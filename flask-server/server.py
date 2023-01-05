import os
import datetime
import mne
import pandas as pd
import numpy as np
from scipy.signal import decimate
import json
import pyedflib
from datetime import datetime, timedelta
from unicodedata import name

from flask import Flask, flash, request, redirect, url_for, session

UPLOAD_FOLDER = '.'
ALLOWED_EXTENSIONS = set(['edf'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ===== PATIENTS ===== #

# TODO: Sort filename, filter newest file of same PID, get PID
@app.route("/patientData")
def patients():
    # Get the list of all files and directories
    path_inProgress = "predict/edfs"
    data_inProgress = os.listdir(path_inProgress)
    path_complete = "predict/copy_edfs"
    data_complete = os.listdir(path_complete)

    # Get PID
    pid_inProgress = []
    for item in data_inProgress:
        pid_inProgress.append(item[0:5])
    pid_complete = []
    for item in data_complete:
        pid_complete.append(item[0:5])
    pid_common = set(pid_inProgress) & set(pid_complete)

    # Create list of patient data
    patientData = []
    for item in data_complete:
        if (item[0:5] not in pid_common):
            data = mne.io.read_raw_edf("predict/copy_edfs/" + item)
            info = data.info
            channels = data.ch_names
            start_time = (info['meas_date'])
            patientData.append({"PID": item[0:5], "PName": "Patient_" + item[0:5], "Status": "Complete", "channels": channels, "MeasurementDate": start_time, "fileName": item})

    for item in data_inProgress:
        data = mne.io.read_raw_edf("predict/edfs/" + item)
        info = data.info
        channels = data.ch_names
        start_time = (info['meas_date'])
        patientData.append({"PID": item[0:5], "PName": "Patient_" + item[0:5], "Status": "In Progress", "channels": channels, "MeasurementDate": start_time, "fileName": item})

    return {"patientData": patientData}

@app.route('/upload', methods=['POST'])
def upload():
    Current_Date = datetime.datetime.today().strftime("%Y%m%d_%H%M%S")

    target=os.path.join(UPLOAD_FOLDER,'predict/edfs')
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file'] 
    filename = file.filename.split(".")
    filename = filename[0] + "_" + Current_Date + ".edf"
    destination="/".join([target, filename])
    file.save(destination)
    session['uploadFilePath']=destination
    response="Upload successful"
    return response

# ===== DASHBOARD ===== #

# TODO: Sort filename, filter newest file of same PID
@app.route("/dashboard/<filename>")
def dashboard(filename):
    # FOR TESTING
    filename = "P0003_24062022_025830.edf"

    # Create list of dashboard data
    dashboardData = []
    data = mne.io.read_raw_edf("predict/copy_edfs/" + filename)
    info = data.info
    start_time = (info['meas_date'])

    csvFilename = filename.split(".")[0]

    with open("predict/prediction/CSV/" + csvFilename + ".csv","r") as file: 
        data = file.readlines() 
    lastRow = data[-1].split(",")
    add_sec=timedelta(seconds=int(lastRow[0]))

    end_time= start_time+add_sec

    sleep_period=end_time-start_time

    data = []
    labels = []
    df = pd.read_csv("predict/prediction/CSV/" + csvFilename + ".csv")
    for i in df.index:
        labels.append({"time": start_time+timedelta(seconds=int(df['time'][i]))})
        if df['y_pred'][i] == 0:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(0) })
        elif df['y_pred'][i] == 4:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-1) })
        elif df['y_pred'][i] == 1:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-2) })
        elif df['y_pred'][i] == 2:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-3) })
        elif df['y_pred'][i] == 3:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-4) })

    stage= df['y_pred'].value_counts()
    # Awake 0
    s0=timedelta(seconds=int(stage[0]*30))
    # N1 1
    s1=timedelta(seconds=int(stage[1]*30))
    # N2 2
    s2=timedelta(seconds=int(stage[2]*30))
    # N3 3
    s3=timedelta(seconds=int(stage[3]*30))
    # REM 4
    s4=timedelta(seconds=int(stage[4]*30))

    # Total sleep time
    total_sleep = sleep_period-s0

    # Percent
    percent_s0= (100.0 * s0.total_seconds())/sleep_period.total_seconds()
    percent_s1= (100.0 * s1.total_seconds())/sleep_period.total_seconds()
    percent_s2= (100.0 * s2)/sleep_period
    percent_s3= (100.0 * s3)/sleep_period
    percent_s4= (100.0 * s4)/sleep_period

    # BarChart Data
    barchart_data = [{
        "AWAKE": round(percent_s0,2),
        "REM": round(percent_s4,2),
        "N1": round(percent_s1,2),
        "N2": round(percent_s2,2),
        "N3": round(percent_s3,2)
    }]

    dashboardData.append({"data": data, "labels": labels, "sleep_period": str(sleep_period),  "total_sleep": str(total_sleep), "barchart_data": barchart_data, "start_time": start_time })
    
    return {"dashboard": dashboardData}

@app.route("/hypnogramData")
def hypnogramData():
    # FOR TESTING
    filename = "P0003_24062022_025830.edf"

    # Create list of edf data
    edfData = []
    data = mne.io.read_raw_edf("predict/copy_edfs/" + filename)
    info = data.info
    start_time = (info['meas_date'])
    start_time_str = str(start_time).split()

    csvFilename = filename.split(".")[0]

    data = []
    labels = []
    df = pd.read_csv("predict/prediction/CSV/" + csvFilename + ".csv")
    for i in df.index:
        labels.append(start_time+timedelta(seconds=int(df['time'][i])))
        if df['y_pred'][i] == 0:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(0)})
        elif df['y_pred'][i] == 4:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-1)})
        elif df['y_pred'][i] == 1:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-2)})
        elif df['y_pred'][i] == 2:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-3)})
        elif df['y_pred'][i] == 3:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-4)})

    edfData.append({"data": data, "labels": labels})
    
    return {"edfData": edfData}

@app.route("/hypnogramFilter/<filename>/<start>/<end>")
def hypnogramFilter(filename, start, end):
    # FOR TESTING
    filename = "P0003_24062022_025830.edf"

    # Create list of edf data
    edfData = []
    data = mne.io.read_raw_edf("predict/copy_edfs/" + filename)
    info = data.info
    start_time = (info['meas_date'])

    csvFilename = filename.split(".")[0]

    data = []
    df = pd.read_csv("predict/prediction/CSV/" + csvFilename + ".csv")
    for i in range(int(start), int(end)):
        if df['y_pred'][i] == 0:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(0)})
        elif df['y_pred'][i] == 4:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-1)})
        elif df['y_pred'][i] == 1:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-2)})
        elif df['y_pred'][i] == 2:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-3)})
        elif df['y_pred'][i] == 3:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-4)})

    edfData.append({"data": data})
    
    return {"edfData": edfData}

# ===== REPORT ===== #

@app.route("/montage/<filename>")
def montage(filename):
    # FOR TESTING
    filename = "P0003_24062022_025830.edf"

    filepath = "predict/copy_edfs/" + filename

    file = pyedflib.EdfReader(filepath)
    signal_labels = file.getSignalLabels()

    file._close()
    del file

    return {"signal_labels": signal_labels}

@app.route("/hypnogramChart/<filename>/<start>/<end>")
def hypnogramChart(filename, start, end):
    # FOR TESTING
    filename = "P0003_24062022_025830.edf"

    # Create list of edf data
    edfData = []
    data = mne.io.read_raw_edf("predict/copy_edfs/" + filename)
    info = data.info
    start_time = (info['meas_date'])
    start_time_str = str(start_time).split()

    csvFilename = filename.split(".")[0]

    data = []
    labels = []
    df = pd.read_csv("predict/prediction/CSV/" + csvFilename + ".csv")
    for i in range(int(start), int(end)):
        if df['y_pred'][i] == 0:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))), "y": int(0)})
        elif df['y_pred'][i] == 4:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))), "y": int(-1)})
        elif df['y_pred'][i] == 1:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))), "y": int(-2)})
        elif df['y_pred'][i] == 2:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))), "y": int(-3)})
        elif df['y_pred'][i] == 3:
            data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))), "y": int(-4)})
    
    return {"hypnogramData": data}

@app.route("/canvasJS/<filename>/<channel>/<start>/<end>")
def canvasJS(filename, channel, start, end):
    # FOR TESTING
    filename = "P0003_24062022_025830.edf"
    channelLabel = channel.split(',')

    filepath = "predict/copy_edfs/" + filename

    file = pyedflib.EdfReader(filepath)
    signal_labels = file.getSignalLabels()
    start_time = file.getStartdatetime()

    chartsData = []
    for c in range(len(channelLabel)):
        channelIndex = signal_labels.index(channelLabel[c])
        n_samples = file.getNSamples()[int(channelIndex)]
        signal_data = file.readSignal(int(channelIndex), int(start), int(end), digital=True)

        data = []
 
        count = 0
        addSec = 0
        for i in range(int(end)):
            data.append({"x": (start_time+timedelta(seconds=int(addSec))).timestamp(), "y": int(signal_data[i])})
            if (count<256): 
                count = count+1
            elif (count == 256):
                addSec = addSec + 1
                count = 0
        
        chartsData.append({"channel": channelLabel[c] ,"data": data})

    file._close()
    del file

    return {"data": chartsData}

# @app.route("/apexcharts/<filename>/<channel>")
# def apexcharts(filename, channel):
#     # FOR TESTING
#     filename = "P0003_24062022_025830.edf"
#     channelLabel = channel.split(',')

#     filepath = "predict/copy_edfs/" + filename

#     file = pyedflib.EdfReader(filepath)
#     signal_labels = file.getSignalLabels()
#     start_time = file.getStartdatetime()

#     chartsData = []
#     for c in range(len(channelLabel)):
#         channelIndex = signal_labels.index(channelLabel[c])
#         n_samples = file.getNSamples()[int(channelIndex)]
#         signal_data = file.readSignal(int(channelIndex), 0, 1000, digital=True)
        
#         chartsData.append({"chartLabel": channelLabel[c], "data": signal_data.tolist()})

#     file._close()
#     del file

#     return {"chartsData": chartsData}

# @app.route("/lineCharts/<filename>/<channel>")
# def lineCharts(filename, channel):
#     # FOR TESTING
#     filename = "P0003_24062022_025830.edf"
#     channelLabel = channel.split(',')

#     filepath = "predict/copy_edfs/" + filename

#     file = pyedflib.EdfReader(filepath)
#     signal_labels = file.getSignalLabels()
#     start_time = file.getStartdatetime()

#     chartsData = []
#     for c in range(len(channelLabel)):
#         channelIndex = signal_labels.index(channelLabel[c])
#         n_samples = file.getNSamples()[int(channelIndex)]
#         signal_data = file.readSignal(int(channelIndex), 0, 7680, digital=True)

#         data = []
#         n_samples = 7680
 
#         for i in range(n_samples):
#             data.append({"x": i, "y": int(signal_data[i])})
        
#         chartsData.append({"chartLabel": channelLabel[c], "data": data})

#     file._close()
#     del file

#     return {"chartsData": chartsData}

# @app.route("/reportHypnogram/<filename>/<start>/<end>")
# def report(filename, start, end):
#     # FOR TESTING
#     filename = "P0003_24062022_025830.edf"

#     # Create list of edf data
#     hypnogramData = []
#     data = mne.io.read_raw_edf("predict/copy_edfs/" + filename)
#     info = data.info
#     start_time = (info['meas_date'])
#     start_time_str = str(start_time).split()

#     csvFilename = filename.split(".")[0]

#     data = []
#     labels = []
#     df = pd.read_csv("predict/prediction/CSV/" + csvFilename + ".csv")
#     for i in range(int(start), int(end)):
#         labels.append(start_time+timedelta(seconds=int(df['time'][i])))
#         if df['y_pred'][i] == 0:
#             data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(0)})
#         elif df['y_pred'][i] == 4:
#             data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-1)})
#         elif df['y_pred'][i] == 1:
#             data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-2)})
#         elif df['y_pred'][i] == 2:
#             data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-3)})
#         elif df['y_pred'][i] == 3:
#             data.append({"x": (start_time+timedelta(seconds=int(df['time'][i]))).timestamp(), "y": int(-4)})

#     hypnogramData.append({"data": data, "labels": labels})
    
#     return {"hypnogramData": hypnogramData}

# @app.route("/reportCharts/<filename>")
# def readfile(filename):
#     # FOR TESTING
#     filename = "P0003_24062022_025830.edf"

#     filepath = "predict/copy_edfs/" + filename

#     file = pyedflib.EdfReader(filepath)
#     n_channels = file.signals_in_file

#     file._close()
#     del file

#     return {"n_channels": n_channels}

# @app.route("/reportChartDetails/<filename>/<channel>")
# def reportChartDetails(filename, channel):
#     # FOR TESTING
#     filename = "P0003_24062022_025830.edf"
#     channel = 0

#     filepath = "predict/copy_edfs/" + filename

#     file = pyedflib.EdfReader(filepath)
#     n_channels = file.signals_in_file
#     signal_labels = file.getSignalLabels()
#     file_duration = file.file_duration
#     start_time = file.getStartdatetime()
#     print(file_duration)
#     print(start_time)

#     channelLabel = file.getLabel(int(channel))
#     n_samples = file.getNSamples()[int(channel)]
#     print(n_samples)
#     # signal_data = file.readSignal(int(channel), 0, 30720, digital=True)
#     signal_data = file.readSignal(0)
#     print(len(signal_data))

#     chartsData = []
#     data = []
#     labels = []
#     n_samples = 7680
#     for i in range(n_samples):
#         labels.append(i)
#         data.append({"x": i, "y": int(signal_data[i])})
            

#     chartsData.append({"data": data, "labels": labels})

#     file._close()
#     del file

#     return {"channelLabel": channelLabel, "chartsData": chartsData}


# @app.route("/edfviewer/<filename>")
# def edfviewer(filename):
#     # FOR TESTING
#     filename = "P0003_24062022_025830.edf"

#     # Create list of edf data
#     edfData = []
#     data = mne.io.read_raw_edf("predict/copy_edfs/" + filename)
#     info = data.info
#     start_time = (info['meas_date'])

#     csvFilename = filename.split(".")[0]

#     data = []
#     df = pd.read_csv("predict/prediction/CSV/" + csvFilename + ".csv")
#     for i in df.index:
#         if df['y_pred'][i] == 0:
#             data.append({"time": start_time+timedelta(seconds=int(df['time'][i])), "y_pred": int(0) })
#         elif df['y_pred'][i] == 4:
#             data.append({"time": start_time+timedelta(seconds=int(df['time'][i])), "y_pred": int(-1) })
#         elif df['y_pred'][i] == 1:
#             data.append({"time": start_time+timedelta(seconds=int(df['time'][i])), "y_pred": int(-2) })
#         elif df['y_pred'][i] == 2:
#             data.append({"time": start_time+timedelta(seconds=int(df['time'][i])), "y_pred": int(-3) })
#         elif df['y_pred'][i] == 3:
#             data.append({"time": start_time+timedelta(seconds=int(df['time'][i])), "y_pred": int(-4) })

#     edfData.append({"data": data})
    
#     return {"edfData": edfData}

# @app.route("/charts/<filename>")
# def charts(filename):
#     # FOR TESTING
#     filename = "P0003_24062022_025830.edf"
    
#     filepath = "predict/copy_edfs/" + filename

#     file = pyedflib.EdfReader(filepath)
#     n_channels = file.signals_in_file
#     signal_labels = file.getSignalLabels()
#     file_duration = file.file_duration
#     start_time = file.getStartdatetime()

#     chartsData = []
#     data = []
#     start = 0
#     end = 256
#     for i in range(n_channels):
#         channelLabel = file.getLabel(i)
#         signal_data = file.readSignal(i, start, end, digital=True)

#         for j in range(end):
#             data.append({"x": j, "y": int(signal_data[j])})

#         chartsData.append({"label": channelLabel, "data": data})

#     file._close()
#     del file

#     return {"chartsData": chartsData}


if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0",use_reloader=False)