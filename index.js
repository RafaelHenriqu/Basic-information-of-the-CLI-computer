import readline from "readline"
import utils from "os-utils"
import { check } from "diskspace"
import os from "os"
const GetCPU = async ({ Target }) => { // --==-- GET CPU DATA --==-- //
    if (!Target) { throw new Error("Missing params") }
    const Data = {
        model() {
            const Model = os.cpus()[0].model
            if (Model.startsWith("AMD")) { return `\x1b[38;5;1m${os.cpus()[0].model}\x1b[0m` }
            if (Model.startsWith("Intel")) { return `\x1b[38;5;39m${os.cpus()[0].model}\x1b[0m` }
            return Model
        },
        used() { return new Promise((resolver) => { utils.cpuUsage((value) => { resolver(`\x1b[38;5;10m ${Math.floor(value * 100).toFixed(1)}%\x1b[0m`) }) }) },
        free() { return new Promise((resolver) => { utils.cpuFree((value) => { resolver(`\x1b[38;5;10m ${Math.floor(value * 100).toFixed(1)}%\x1b[0m`) }) }) }

    }
    try { return await Data[Target]() } catch { throw new Error(`The Function ${Target} Does not exist`) }

}

const GetRAM = ({ Target }) => { // --==-- GET RAM MEMORY --==-- //
    if (!Target) { throw new Error("Missing params") }
    const Data = {
        total() { return `\x1b[38;5;49m${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB\x1b[0m`.replace(".", ",") },
        free() { return `\x1b[38;5;49m${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB\x1b[0m`.replace(".", ",") }
    }
    try { return Data[Target]() } catch { throw new Error(`The Function ${Target} Does not exist`) }
}

const GetDisk = async ({ Target }) => { // --==-- GET Disk --==-- //
    if (!Target) { throw new Error("Missing params") }
    try { return await new Promise((resolver) => { check("C" || "/", (Error, result) => { if (Error) { throw new Error(`--- Failed to fetch disk ---`) }; resolver(`\x1b[38;5;255m${(result[Target] / 1024 / 1024 / 1024).toFixed(0)} GB\x1b[0m`) }) }) } catch { throw new Error(`The Function ${Target} Does not exist`) }
}

setInterval(async () => {
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    process.stdout.write('\x1B[?25l');
    process.stdout.write(`\x1b[32m--==-- CPU --==-- \x1b[0m
\x1b[33m Model:\x1b[0m ${await GetCPU({ Target: "model" })}
\x1b[33m Used:\x1b[0m ${await GetCPU({ Target: "used" })}

\x1b[32m--==-- Ram --==-- \x1b[0m
\x1b[33m Total:\x1b[0m ${GetRAM({ Target: "total" })}
\x1b[33m Free:\x1b[0m ${GetRAM({ Target: "free" })}

\x1b[32m--==-- Disk --==-- \x1b[0m
\x1b[33m Total:\x1b[0m ${await GetDisk({ Target: "total" })}
\x1b[33m Free:\x1b[0m ${await GetDisk({ Target: "free" })}
\x1b[33m Used:\x1b[0m ${await GetDisk({ Target: "used" })}
`)
}, 1000)