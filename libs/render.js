'use strict'

const RenderKid   = require('renderkid')
const styleLoader = require('../styles/loader')
const errorStack  = require('./errorstack')
const util        = require('./util')

// Expose some modules that libs depend on
exports.styleLoader = styleLoader

// By default the capturedError is false (a module is supposed to set this value for exports.stack header)
exports.capturedError = false

// How a the html is rendered by renderKid
exports.html = html => {
    // Get the style again, because it might have changed
    const r = new RenderKid()
    r.style(styleLoader.getStyle())

    return r.render(html)
}

// How a console-debug stacktrace is rendered
exports.stack = stack => {
    // A 'header' template. This is used for showing exceptions or other useful title messages
    let header = ''

    // Show a error
    if (exports.capturedError) {
        header += `
            <exception>uncaughtException</exception>:<exceptiontext>${exports.capturedError}</exceptiontext>
        `

        // Reset the capturedError because it was displayed
        exports.capturedError = false
    }

    // Add the li 'traces'
    let traces = ''
    for (let i = stack.length - 1; i >= 0; i--) {
        const trace      = stack[i]
        let functionName = stack[i].functionName
        if (functionName === null) {
            functionName = ''
        }

        const fileNameTruncated = util.truncateFilePath(trace.fileName)

        // A 'traces' template
        traces += `
            <li>
                - <filename>${fileNameTruncated}</filename>:<line>${trace.lineNumber}</line>
                <function>${functionName}</function>
                <subtext>${trace.fileName}:${trace.lineNumber}:${trace.columnNumber}</subtext>
            </li>
        `
    }

    // Render the main template
    const output = `
        <ul>
            ${header}
            <li>
                ${traces}
            </li>
        </ul>
    `
    console.log(exports.html(output))
}

exports.console = (msg, type) => {
    const stack = errorStack.getStack()
    let output  = ''

    for (let i = 0; i < stack.length; i++) {
        // Capture the trace where errorStack.capture() was called
        if (stack[i].methodName === 'capture' && stack[i].isFromConsoleDebug) {
            // Then go back 2 traces and start to render from there.
            const trace = stack[i - 2]

            // Truncate long filepaths
            const fileName = util.truncateFilePath(trace.fileName)

            // And normalize the input
            const renderText = util.normalizeInput(msg)

            output += `
                <${type}>${type}</${type}><filename>${fileName}</filename>:<line>${trace.lineNumber}</line>
                <consoletext>${renderText}</consoletext>
            `
        }
    }

    console.log(exports.html(output))
}
