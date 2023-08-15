# E1 Folder Structure

* analysis/:
    - figures/: Contains vectorized SVG files for the Experiment 1 figures included in the paper.
    - Analysis (IT-FDR2).ipynb: TBA
    - Processing (IT-FDR2).ipynb: TBA
    - Screening (IT-FDR2).ipynb: TBA
    - Stats (IT-FDR2).R: TBA
* data/:
    - excluded.txt: TBA
    - Illusory*.csv: TBA
    - musical_training.csv: TBA
    - scores.csv: TBA
* headphone_check/: Stimulus files for the headphone test of Woods et al., 2017 (<https://doi.org/10.3758/s13414-017-1361-2>). The last three letters of each file name indicate which of the three tones is played In-phase, Out-of-phase, and Softer.
* plugins/: A folder for custom jsPsych plugins.
    - audio-multiple-response.js: A custom jsPsych plugin for presenting an audio file and recording multiple keyboard responses. Used for taking spontaneous motor tempo measurements.
* preparation/: Python code used for preparing the stimuli and trial schedules used in the experiment.
    - Tone Generation (IT-FDR2).ipynb: Code to 1) generate the raw tone files using librosa, and 2) arrange loudness-normalized tones into the stimulus sequence files found in sequences/. Loudness normalization was performed separately in Audacity.
    - Trial Randomization (IT-FDR2).ipynb: Code to pre-generate randomized trial orders, which are saved in schedules/.
* schedules/: JSON files containing pre-generated randomized trial orders. The experiment.js code loads session[ID].json as the trial schedule, where [ID] is the participant's ID number (assigned automatically by our pre-session questionnaire that was conducted on LimeSurvey).
* stimuli/: All wav files used as stimuli in the experiment.
    - tones/: Contains raw and loudness-normalized versions of each tone and click used in the experiment. Tones are labeled by their pitch class and octave, e.g. toneA3 is A3 (220 Hz).
    - sequence\_[task_type]\_[pitch]\_[tempo]\_[offset].wav: The stimulus sequence for trials of the specified task type, pitch, tempo, and percent timing offset. Task 0 is the pitched context condition and Task 1 is the pitched probe condition.
* experiment.js: The jsPsych code for running Experiment 1 on Pavlovia. Includes Pavlovia integration.
* index.html: The HTML code for running Experiment 1 on Pavlovia. Note that the jsPsych library sources are not included in this repository, as Pavlovia hosts their own copy of jsPsych that our HTML code automatically accessed.