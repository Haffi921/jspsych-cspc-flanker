const counterbalancer = require("./sequencer/counterbalancer");
const sequencer = require("./sequencer/sequencer");

const TRIAL_TYPES = [
    {
        distractor: "HH HH",
        target: "HHHHH",
        congruency: "congruent",
        type: "inducer",
        correct_key: "h",
    },
    {
        distractor: "HH HH",
        target: "HHSHH",
        congruency: "incongruent",
        type: "inducer",
        correct_key: "s",
    },
    {
        distractor: "SS SS",
        target: "SSSSS",
        congruency: "congruent",
        type: "inducer",
        correct_key: "s",
    },
    {
        distractor: "SS SS",
        target: "SSHSS",
        congruency: "incongruent",
        type: "inducer",
        correct_key: "h",
    },
    {
        distractor: "AA AA",
        target: "AAAAA",
        congruency: "congruent",
        type: "transfer",
        correct_key: "a",
    },
    {
        distractor: "AA AA",
        target: "AAFAA",
        congruency: "incongruent",
        type: "transfer",
        correct_key: "f",
    },
    {
        distractor: "FF FF",
        target: "FFFFF",
        congruency: "congruent",
        type: "transfer",
        correct_key: "f",
    },
    {
        distractor: "FF FF",
        target: "FFAFF",
        congruency: "incongruent",
        type: "transfer",
        correct_key: "a",
    },
];

const MOSTLY_CONGRUENT = [32, 8, 32, 8, 5, 5, 5, 5];
const MOSTLY_INCONGRUENT = [8, 32, 8, 32, 5, 5, 5, 5];
const POSITION_MATRIX = [[50, 50], [50, 50]]
const UPPER_POSITION = "top-stim"
const LOWER_POSITION = "bottom-stim"

function produce_sequence(participant_nr) {
    // const rep_switch = Math.ceil(participant_nr / 2) % 2 == 0 ? MOSTLY_SWITCHES : MOSTLY_REPETITIONS
    const is_even = (i) => i % 2 === 0;
    const add_position = (odd, even) => (a) => { a.position = is_even(participant_nr) ? even : odd; return a };

    const context_zipper = () => {
        // Create mostly congruent and mostly incongruent sequences
        const context_sequences = [
            // Mostly congruent
            sequencer(MOSTLY_CONGRUENT, TRIAL_TYPES)
                // Odd nr participants get this as upper context; Even nr get this as lower context
                .map(add_position(UPPER_POSITION, LOWER_POSITION)),
            
            // Mostly incongruent
            sequencer(MOSTLY_INCONGRUENT, TRIAL_TYPES)
                // Odd nr participants get this as lower context; Even nr get this as upper context
                .map(add_position(LOWER_POSITION, UPPER_POSITION)),
        ];

        // Returns a map function zips together the context sequences based on the order of 0 and 1 in the array which is being mapped
        return (a) => context_sequences[a].shift();
    };

    // Return sequence is a counterbalanced amount of context repetition and switches
    return counterbalancer(POSITION_MATRIX)
        // Populated with each context
        .map(context_zipper());
}

module.exports = produce_sequence