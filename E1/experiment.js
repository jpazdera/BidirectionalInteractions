/* - - - - LOAD ID - - - - */
var urlvars = jsPsych.data.urlVariables();
var minID = 1;
var maxID = 300;
var subjectID;

 // If participant has a valid ID, use it, otherwise assign a random ID
if (('participant' in urlvars) && !(isNaN(parseInt(urlvars['participant']))) &&
(parseInt(urlvars['participant']) >= minID) && (parseInt(urlvars['participant']) <= maxID)) {
    subjectID = parseInt(urlvars['participant']);
} else {
    subjectID = Math.floor(Math.random() * (maxID - minID + 1)) + minID;
}

// The task type is randomized for each participant (0 is tone sequences, 1 is click sequences)
var task_type = jsPsych.randomization.sampleWithoutReplacement([0, 1], 1)[0];

var audio_test_score = 0;

// Add session metadata
jsPsych.data.addProperties({
    subject: subjectID,
    type: task_type,
    experiment: 'ITFDR2',
    code_version: 'v1.0'
});

// Use participant ID number to load the trial order, and don't run anything else until it's done loading
$.getJSON(`schedules/session${subjectID}.json`).done(function (schedule) {

    /* - - - - SETTINGS - - - - */

    var n_blocks = 8
    var trials_per_block = 42;
    var post_instruction_delay = 2000;
    var post_response_delay = 1500;

    /* - - - - PAVLOVIA INTEGRATION - - - - */

    var pavlovia_init = {
        type: 'pavlovia',
        command: 'init'
    };

    var pavlovia_finish = {
        type: 'pavlovia',
        command: 'finish'
    };

    /* - - - - INSTRUCTIONS - - - - */

    // Welcome message
    var welcome = {
        type: 'html-keyboard-response',
        data: { event: 'welcome' },
        stimulus: '<p>Welcome to the study! Press any key to begin reading the instructions.</p>'
    };

    // Instructions about requirements for the experiment
    var instructions_requirements = {
        type: 'html-button-response',
        data: { event: 'requirements' },
        choices: ['Continue'],
        stimulus: '<p>Before we begin, please close all other browser tabs and programs that may produce sound ' +
        'alerts or notifications, or which you may find distracting.</p><p>In this study, we will ask you to listen ' +
        'to sequences of sounds and to make some judgments about them. Because of this, it\'s important that you ' +
        'complete this study using headphones while seated in a quiet environment. If it\'s not currently possible ' +
        'for you to satisfy this requirement, please return to complete the experiment at a later time.</p><p>If ' +
        'you are currently using Safari to access the study, please note that the task may not run properly in ' +
        'this browser, and it may prevent you from hearing any sounds. You should copy the URL from this page and ' +
        'paste it into a different web browser to complete the study there, instead. Chrome, Firefox, and Edge are ' +
        'all officially supported. We apologize for any inconvenience!</p><p>If the text instructions appear too ' +
        'large or too small on your screen, you should adjust your browser\'s zoom level at this time. When you are ' +
        'ready to continue, press the button below.</p>'
    };

    // Instructions for pre-experiment headphone test
    var instructions_audio_test = {
        type: 'html-button-response',
        data: { event: 'headphone_test_instructions' },
        choices: ['Start'],
        post_trial_gap: post_instruction_delay,
        stimulus: '<p>First, we\'ll complete an audio test to make sure you can accurately hear the sounds we\'ll be ' +
        'presenting throughout the study. In this test, you will hear several sets of three tones. For each set, ' +
        'your goal is to determine which of the three tones is the <strong>quietest</strong>.</p><p>After hearing ' +
        'each set of tones, you will be prompted to press the 1, 2, or 3 key to indicate whether the first, second, ' +
        'or third tone was the quietest.</p><p>Press the button below to begin the test.</p>'
    };

    // Instructions for pre-experiment tapping task
    var instructions_tapping_test = {
        type: 'html-keyboard-response',
        data: { event: 'tap_task_instructions' },
        choices: [32],
        post_trial_gap: post_instruction_delay,
        stimulus: '<p>Thank you for completing the audio test! Next, you will be asked to tap your finger for a ' +
        'short time at the rate that feels most natural and comfortable to you.</p><p>If you are right-handed, ' + 
        'you should tap the J key with your right index finger during this task. If you are left-handed, you ' +
        'should instead tap the F key with your left index finger.</p><p>While completing this exercise, you ' +
        'should rest your wrist on a solid surface and keep your hand still, moving only your index finger to tap ' +
        'the specified key. Go ahead and place your hand in the appropriate position at this time. You should begin ' +
        'tapping when you see a cross (+) appear on the screen, and you should continue tapping until it disappears.' +
        '</p><p>Remember, you should tap at whatever rate feels most <strong>natural and comfortable</strong> to ' +
        'you. Press the SPACEBAR when you are ready to begin.</p>'
    };
    
    // Main task instructions (pre-practice)
    var instructions_main = {
        type: 'html-button-response',
        data: { event: 'main_instructions' },
        choices: ['Start'],
        post_trial_gap: post_instruction_delay,
        stimulus: '<p>Now we\'re ready to proceed to the main task.</p><p>' +
        '<strong>Instructions:</strong> On each trial, you will hear a sequence of sounds marking a steady beat. ' +
        'After five beats there will be a short period of silence lasting for two additional beats, and these ' +
        'silent beats will be followed by one final sound. This final sound will be played either earlier or later ' +
        'than the next beat should have occurred. Your goal is to track the beat through the silent ' +
        'period, in order to determine whether that final sound was played too early or too late. After each ' +
        'sequence, you will be asked to <strong>press 1 if the final tone was played early</strong> or <strong>2 if ' +
        'it was played late</strong>.</p><p>' +
        'We\'re interested in the limits of human abilities, so you may sometimes find it difficult to tell whether ' +
        'the final sound played early or late. It\'s okay if you\'re not always certain - just give it your best ' +
        'guess.</p><p>' +
        'Let\'s try a few practice sequences to start out. This will give you the chance to familiarize yourself ' +
        'with the task and to adjust your volume to a comfortable level. Click the button below when you are ready ' +
        'to start practicing.</p>'
    };

    // Final main task instructions (post-practice)
    var instructions_final = {
        type: 'html-button-response',
        data: { event: 'summary_instructions' },
        choices: ['Start'],
        post_trial_gap: post_instruction_delay,
        stimulus: '<p>You\'re now ready to begin!</p><p>If the practice trials were too loud or too soft, ' +
        'please finish adjusting your volume at this time. It is important that you do not adjust your volume any ' +
        'further until the study has concluded.</p><p>Please note that the trials will be organized into ' +
        (n_blocks).toString() + ' sections, each of which will last about 5 minutes. You will have the opportunity ' +
        'to take a break after each section.</p><p>Press the button below to begin.</p>'
    };
        
    // Completion screen
    var ending = {
        type: 'html-button-response',
        data: { event: 'ending' },
        choices: ['Submit'],
        stimulus: '<h3>You have completed section ' + (n_blocks).toString() + ' of ' + (n_blocks).toString() +
        '!</h3><p>Thank you for participating! When you are ready, press the button below to submit your data and ' +
        'complete the study.</p><p>You will receive credit on SONA once we verify that you have completed our ' +
        'study, which will likely occur within the next 24 hours.</p><p>If you have any questions about the study ' +
        'or would like to learn more about our lab\'s work, please contact Jesse Pazdera at pazderaj@mcmaster.ca.' +
        '</p><p><em>Have a great day!</em></p>'
    };
    
    // Placeholder debriefing form
    var debrief = {
        type: 'html-button-response',
        data: { event: 'debrief' },
        choices: ['Exit'],
        stimulus: '<h1>About This Study</h1>' +
        '<h3>Principal Investigator: Dr. Laurel J. Trainor (ljt@mcmaster.ca)</h3>' +
        '<h3>Researcher: Jesse K. Pazdera, B.Sc. (pazderaj@mcmaster.ca)</h3>' +
        '<p style="text-align: justify; text-indent: 35px; max-width: 750px;">In this study, you listened to ' +
        'sequences of sounds and rated whether the final sound arrived early or late. The first five sounds of the ' +
        'sequences played at a steady rate of 100 or 150 beats per minute, and the final sound was played out of ' +
        'time by somewhere between 30% early and 30% late. Depending on which task you were randomly assigned, you ' +
        'may have heard sequences of tones followed by a click, or you may have heard sequences of clicks followed ' +
        'by a final tone. In either case, the tones varied in their pitch (how high or low they were). We are ' +
        'specifically interested in whether pitch can make sounds seem faster or slower than they truly are. Recent ' +
        'experiments from our lab suggest that people perceive low-pitched sounds as slower than high-pitched ' +
        'sounds, but that extremely high-pitched sounds may actually seem slower than moderately high-pitched ' +
        'sounds. Therefore, some of the tones you heard were low-pitched, some were high-pitched, and some were ' +
        'extremely high-pitched. By testing your ability to detect small timing errors in different pitch ranges, ' +
        'we can determine whether pitch alters how you track time. Your participation will help us to better ' +
        'understand how our brains process the timing of speech and music.</p>' +
        '<h3 style="max-width: 750px;">We would like to thank you again for participating in our study. If you ' +
        'would like to learn more about our lab\'s research, please contact Jesse Pazdera at the email listed ' +
        'above. Your responses have been saved and you may close your browser at any time.</h3>' 
    };

    /* - - - - PRE-TASKS - - - - */

    // Audio test
    var sound_check_procedure = {
        timeline: [
            // Audio test stimulus
            {
                type: 'audio-keyboard-response',
                data: { event: 'headphone_test_tones', test_answer: jsPsych.timelineVariable('answer') },
                stimulus: jsPsych.timelineVariable('stimulus'),
                response_ends_trial: false,
                trial_ends_after_audio: true,
                prompt: '<h3>Sound check</h3><p>You should hear three tones in a sequence. Try to determine which tone is the <strong>quietest</strong>.</p>'
            },
            // Audio test response
            {
                type: 'html-keyboard-response',
                data: { event: 'headphone_test_response', test_answer: jsPsych.timelineVariable('answer') },
                choices: ['1', '2', '3', '0'],
                post_trial_gap: post_response_delay,
                stimulus: '<p>Press the 1, 2, or 3 key on your keyboard to indicate which tone was the quietest.</p>' +
                    '<p>If you were not able to hear three tones, check that your headphones are working and that your volume is turned up, then press 0.</p>',
                on_finish: function(data) {
                    if (jsPsych.pluginAPI.compareKeys(data.key_press, data.test_answer)) {
                        audio_test_score += 1;
                    }
                }
            }
        ],
        timeline_variables: [
            { stimulus: 'headphone_check/antiphase_HC_IOS.wav', answer: 51 },
            { stimulus: 'headphone_check/antiphase_HC_ISO.wav', answer: 50 },
            { stimulus: 'headphone_check/antiphase_HC_OIS.wav', answer: 51 },
            { stimulus: 'headphone_check/antiphase_HC_OSI.wav', answer: 50 },
            { stimulus: 'headphone_check/antiphase_HC_SIO.wav', answer: 49 },
            { stimulus: 'headphone_check/antiphase_HC_SOI.wav', answer: 49 },
        ],
        randomize_order: true
    };
    
    // Audio re-test if first test was failed
    var sound_retest_instructions = {
        type: 'html-button-response',
        data: { event: 'headphone_test_instructions' },
        choices: ['Start'],
        post_trial_gap: post_instruction_delay,
        stimulus: '<p>Thank you for completing the audio test! Unfortunately, you answered fewer than 4 out of 6 ' +
        'trials correctly. Please note that you may not be able to tell which tone is quietest without wearing ' +
        'headphones or earbuds. If you are not already wearing them, please connect them before continuing. If you ' +
        'are already wearing headphones, please make sure your volume is turned up loud enough to hear every sound ' +
        'clearly. When you are ready, press the button below to try the audio test one more time.'
    };
    
    var sound_retest_procedure = {
        timeline: [
            // Audio test stimulus
            {
                type: 'audio-keyboard-response',
                data: { event: 'headphone_retest_tones' },
                stimulus: jsPsych.timelineVariable('stimulus'),
                response_ends_trial: false,
                trial_ends_after_audio: true,
                prompt: '<h3>Sound check</h3><p>You should hear three tones in a sequence. Try to determine which tone is the <strong>quietest</strong>.</p>'
            },
            // Audio test response
            {
                type: 'html-keyboard-response',
                data: { event: 'headphone_retest_response' },
                choices: ['1', '2', '3', '0'],
                post_trial_gap: post_response_delay,
                stimulus: '<p>Press the 1, 2, or 3 key on your keyboard to indicate which tone was the quietest.</p>' +
                '<p>If you were not able to hear three tones, check that your headphones are working and that your volume is turned up, then press 0.</p>'
            }
        ],
        timeline_variables: [
            { stimulus: 'headphone_check/antiphase_HC_IOS.wav'},
            { stimulus: 'headphone_check/antiphase_HC_ISO.wav'},
            { stimulus: 'headphone_check/antiphase_HC_OIS.wav'},
            { stimulus: 'headphone_check/antiphase_HC_OSI.wav'},
            { stimulus: 'headphone_check/antiphase_HC_SIO.wav'},
            { stimulus: 'headphone_check/antiphase_HC_SOI.wav'},
        ],
        randomize_order: true,
    };
    
    var sound_retest_timeline = {
        timeline: [sound_retest_instructions, sound_retest_procedure],
        conditional_function: function() {  // Only perform audio retest if the person's score was less than 4/6
            if (audio_test_score < 4) {
                return true;
            } else {
                return false;
            }
        }
    };

    // Practice Trials
    var practice_trials = {
        timeline: [
            // Tone presentation
            {
                type: 'audio-keyboard-response',
                data: {
                    event: 'practice_tones', 
                    type: `${task_type}`,
                    pitch: jsPsych.timelineVariable('pitch'),
                    interval: jsPsych.timelineVariable('interval'),
                    offset: jsPsych.timelineVariable('offset')
                },
                stimulus: jsPsych.timelineVariable('stimulus'),
                response_ends_trial: false,
                trial_ends_after_audio: true
            },
            // Response screen
            {
                type: 'html-keyboard-response',
                data: {
                    event: 'practrice_response',
                    type: `${task_type}`,
                    pitch: jsPsych.timelineVariable('pitch'),
                    interval: jsPsych.timelineVariable('interval'),
                    offset: jsPsych.timelineVariable('offset')
                },
                stimulus: 'Did the final tone begin (1) early or (2) late?',
                choices: ['1', '2']
            },
            // Feedback for practice
            {
                type: 'html-keyboard-response',
                data: { event: 'practice_feedback' },
                response_ends_trial: true,
                stimulus: jsPsych.timelineVariable('answer'),
                post_trial_gap: post_response_delay
            }
        ],
        timeline_variables: [
            {stimulus: `stimuli/sequence_${task_type}_F4_500_-30.wav`, pitch: 'F4', interval: 500, offset: -30, answer: '<strong>Answer:</strong> The final tone began <strong>early</strong> on this trial. Press any key to continue.'},
            {stimulus: `stimuli/sequence_${task_type}_F4_500_30.wav`, pitch: 'F4', interval: 500, offset: 30, answer: '<strong>Answer:</strong> The final tone began <strong>late</strong> on this trial. Press any key to continue.'},
            {stimulus: `stimuli/sequence_${task_type}_G4_500_-30.wav`, pitch: 'G4', interval: 500, offset: -30, answer: '<strong>Answer:</strong> The final tone began <strong>early</strong> on this trial. Press any key to continue.'},
            {stimulus: `stimuli/sequence_${task_type}_G4_500_30.wav`, pitch: 'G4', interval: 500, offset: 30, answer: '<strong>Answer:</strong> The final tone began <strong>late</strong> on this trial. Press any key to continue.'},
            {stimulus: `stimuli/sequence_${task_type}_F6_500_-30.wav`, pitch: 'F6', interval: 500, offset: -30, answer: '<strong>Answer:</strong> The final tone began <strong>early</strong> on this trial. Press any key to continue.'},
            {stimulus: `stimuli/sequence_${task_type}_F6_500_30.wav`, pitch: 'F6', interval: 500, offset: 30, answer: '<strong>Answer:</strong> The final tone began <strong>late</strong> on this trial. Press any key to continue.'},
            {stimulus: `stimuli/sequence_${task_type}_G6_500_-30.wav`, pitch: 'G6', interval: 500, offset: -30, answer: '<strong>Answer:</strong> The final tone began <strong>early</strong> on this trial. Press any key to continue.'},
            {stimulus: `stimuli/sequence_${task_type}_G6_500_30.wav`, pitch: 'G6', interval: 500, offset: 30, answer: '<strong>Answer:</strong> The final tone began <strong>late</strong> on this trial. Press any key to continue.'}
        ],
        randomize_order: true
    }

    // Spontaneous production rate test
    var tapping_test = {
        type: 'audio-multiple-response',
        data: { event: 'tapping_test' },
        stimulus: '',
        prompt: '<h1>+</h1>',
        trial_ends_after_audio: false,
        trial_duration: 20000,
        post_trial_gap: post_response_delay
    };
    
    // Build list of audio files that will need to be loaded
    var audio_files = new Set();
    var headphone_check_strings = ['IOS', 'ISO', 'OIS', 'OSI', 'SIO', 'SOI'];
    for (i in headphone_check_strings) {
        s = headphone_check_strings[i];
        audio_files.add(`headphone_check/antiphase_HC_${s}.wav`);
    }
    var practice_strings = ['F4_500_-30', 'F4_500_30', 'G4_500_-30', 'G4_500_30', 'F6_500_-30', 'F6_500_30', 'G6_500_-30', 'G6_500_30']
    for (i in practice_strings) {
        s = practice_strings[i];
        audio_files.add(`stimuli/sequence_${task_type}_${s}.wav`);
    }

    /* - - - - BLOCKING - - - - */

    // Add instructions, audio test, SPR test and practice trials to timeline
    var timeline = [
        pavlovia_init, welcome, instructions_requirements, 
        instructions_audio_test, sound_check_procedure, sound_retest_timeline,
        instructions_tapping_test, tapping_test, 
        instructions_main, practice_trials, instructions_final
    ];

    // Dynamically construct trials based on schedule, while adding each audio file to the preload list
    for (block = 0; block < n_blocks; block++) {
        for (trial = 0; trial < trials_per_block; trial++) {
            // Add stimulus to audio file list
            audio_files.add(`stimuli/sequence_${task_type}_${schedule[block * trials_per_block + trial][0]}_${schedule[block * trials_per_block + trial][1]}_${schedule[block * trials_per_block + trial][2]}.wav`);
            
            // Stimulus presentation event
            timeline.push({
                type: 'audio-keyboard-response',
                stimulus: `stimuli/sequence_${task_type}_${schedule[block * trials_per_block + trial][0]}_${schedule[block * trials_per_block + trial][1]}_${schedule[block * trials_per_block + trial][2]}.wav`,
                response_ends_trial: false,
                trial_ends_after_audio: true,
                data: {
                    event: 'tones', 
                    type: `${task_type}`,
                    pitch: `${schedule[block * trials_per_block + trial][0]}`,
                    interval: `${schedule[block * trials_per_block + trial][1]}`,
                    offset: `${schedule[block * trials_per_block + trial][2]}`
                },
            });
            // Response screen event
            timeline.push({
                type: 'html-keyboard-response',
                stimulus: 'Did the final tone begin (1) early or (2) late?',
                choices: ['1', '2'],
                post_trial_gap: post_response_delay,
                data: { 
                    event: 'response', 
                    type: `${task_type}`,
                    pitch: `${schedule[block * trials_per_block + trial][0]}`,
                    interval: `${schedule[block * trials_per_block + trial][1]}`,
                    offset: `${schedule[block * trials_per_block + trial][2]}` 
                },
            });
        }
        // Break period
        if (block < n_blocks - 1) {
            timeline.push({
                type: 'html-button-response',
                data: { event: 'break' },
                choices: ['Continue'],
                post_trial_gap: post_instruction_delay,
                stimulus: '<h3>You have completed section ' + (block + 1).toString() + ' of ' + (n_blocks).toString() +
                '!</h3><p>When you are ready to continue, press the button below to begin the next section.</p>' +
                '<p><em>Please remember not to adjust your volume until the study has concluded.</em></p>'
            });
        }
    }

    // Set up experiment conclusion
    timeline.push(ending);
    timeline.push(pavlovia_finish);
    timeline.push(debrief);

    audio_files = Array.from(audio_files)

    /* - - - - EXECUTION - - - - */

    jsPsych.init({
        timeline: timeline,
        default_iti: 0,
        use_webaudio: true,
        preload_audio: audio_files,
        show_preload_progress_bar: true,
        show_progress_bar: true,
        exclusions: {audio: true}
    });
});