# Data Codebook for Experiment 1

## Codebook for individual session data (Illusory*.csv)
### Metadata
* subject: The ID number of the participant.
* experiment: The abbreviated name of the experiment. Useful if combining data from multiple experiments into one table. Always ITFDR2 for this experiment.
* code_version: The version number of the code used to run that session. Always v1.0 for this experiment.
* event: The name of the event that generated the data entry. One of the following:
    - welcome: The welcome screen for the experiment.
    - requirements: A page informing participants of the requirements to participate (supported browsers, wear headphones, etc.)
    - headphone_test_instructions: The instructions for the headphone test.
    - headphone_test_tones: The presentation of a set of three tones during the headphone test.
    - headphone_test_response: The prompt for a response to a headphone test trial.
    - tap_task_instructions: The instructions for the spontaneous motor tempo task.
    - tapping_test: The spontaneous motor tempo (self-paced tapping) task.
    - main_instructions: The instructions for the main timing discrimination task.
    - practice_tones: Stimulus presentation for a practice trial of the timing discrimination task. 
    - practice_response: Prompt to respond to a practice trial of the timing discrimination task.
    - practice_feedback: A screen giving feedback as to what the correct answer was on a practice trial.
    - summary_instructions: Post-practice page giving the participant a reminder summary of the main task instructions.
    - tones: Stimulus presentation for one trial of the timing discrimination task.
    - response: Prompt to respond to a trial of the timing discrimination task.
    - break: A self-paced break in between blocks of trials.
    - ending: The final page informing the participant that they have finished the experiment and should receive credit soon.
* trial_type: The jsPsych event type that generated the data entry. (Less informative than the event column.)
* trial_index: Event number.
* internal_node_id: jsPsych's internal event IDs.
* time_elapsed: Milliseconds elapsed since the experiment began.

### Condition data
* stimulus: The text displayed on the screen or the audio file played during that event.
* type: Indicates whether the participant was in the pitched context condition (type = 0) or the pitched probe condition (type = 1).
* pitch: Indicates the pitch class and octave of the context (if type = 0) or probe tone (if type = 1) on that trial.
* interval: The interonset interval of the pacing signal on that trial.
* offset: The percent timing offset of the probe on that trial. Positive numbers indicate a late probe and negative numbers indicate an early probe.

### Response data
* rt: The number of milliseconds after the event began that a response was recorded.
* key_press: The key ID number that was pressed in response to the event. (For events that use keyboard responses.) See <http://www.foreui.com/articles/Key_Code_Table.htm> for a dictionary of key codes. 
* button_pressed: The button ID number that was pressed in response to the event. (For events that use button responses.)
* test_answer: The keypress to answer a given headphone test trial correctly.

## Codebook for processed data (scores.csv)
### Condition data
* subject: subject ID number
* task_type: Indicates whether the participant was in the pitched context condition (type = 0) or the pitched probe condition (type = 1).
* octave: Indicates that the data in this row corresponds to scores from trials of that octave (3, 5 or 7).
* ioi: Indicates that the data in the row corresponds to scores from trials of that interonset interval (400 or 600).
### Condition-rspecific scores
* accuracy: The participant's percent accuracy across all trials of the specified octave and IOI condition.
* perc_resp_early: The percent of probes the participant labelled as early across all trials of the specified octave and IOI.
* hit_rate: The participant's hit rate across all trials of the specified octave and IOI condition.
* fa_rate: The participant's false alarm rate across all trials of the specified octave and IOI condition.
* dprime: The participant's sensitivity (d') across all trials of the specified octave and IOI condition.
* C: The participant's bias (C) to rate probes as early across all trials of the specified octave and IOI condition.
### Full-session scores
* subj_accuracy: The participant's overall percent accuracy across all trials of all conditions.
* subj_perc_resp_early: The overall percent of probes the participant labelled as early across trials of all conditions.
* subj_hit_rate: The participant's overall hit rate across all trials of all conditions.
* subj_fa_rate: The participant's overall false alarm rate across all trials of all conditions.
* subj_dprime: The participant's overall sensitivity (d') across all trials of all conditions.
* subj_C: The participant's overall bias (C) to rate probes as early across all trials of all conditions.
