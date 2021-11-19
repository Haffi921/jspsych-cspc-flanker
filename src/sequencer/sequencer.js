function sequencer(weights, trial_types) {
    const sum = arr => arr.reduce((a, b) => a + b, 0)

    const nr_trials = sum(weights)
    let trials = Array(nr_trials).fill(0)
    const probabilities = weights.map(a => a / nr_trials).map((a, i, d) => i == 0 ? a : a + sum(d.slice(0, i)))

    function get_index() {
        const r = Math.random()
        return probabilities.findIndex(a => r < a)
    }

    for (let trial in trials) {
        let found = false
        while (!found) {
            const factor = get_index()
            if (weights[factor] > 0) {
                trials[trial] = factor
                --weights[factor]
                found = true
            }
        }
    }

    if (trial_types) {
        return trials.map(a => Object.assign({}, trial_types[a]))
    }
    else {
        return trials
    }
}

module.exports = sequencer