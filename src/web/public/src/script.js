const { useState, useEffect, useMemo, useCallback, useRef, Fragment: F } = React

function byteToData(a, b = 2) {
    if (0 === a) return "0 Bytes"
    const c = 0 > b ? 0 : b,
        d = Math.floor(Math.log(a) / Math.log(1024))
    const datas = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + datas[d]
}

function usageBarColor(percent) {
    if (percent > 90) return "#e44"
    if (percent > 75) return "#cc2"
    return "#4e4"
}

function defineOnGlobal(o) {
    Object.entries(o).forEach(([key, value]) => {
        if (window.hasOwnProperty(key)) delete window[key]
        Object.defineProperty(window, key, { value, configurable: true })
    })
}

function join(...classNames) {
    return classNames
        .filter((str) => typeof str === "string")
        .map((str) => str.trim())
        .filter((str) => str.length)
        .join(" ")
}

function useForceUpdate() {
    const [, setValue] = useState(0)
    return useCallback(() => setValue((value) => value + 1), [])
}

function Item(props) {
    return (
        <div
            className={
                props.className
                    ? props.className.toLowerCase()
                    : props.name.toLowerCase()
            }
            name={props.name}
        >
            <details
                open={
                    props.openByDefault === undefined
                        ? true
                        : props.openByDefault
                }
            >
                <summary>
                    <p className="name">{props.name}</p>
                    {props.description && (
                        <F>
                            <p className="hyphen"> - </p>
                            <p className="desc">{props.description}</p>
                        </F>
                    )}
                </summary>
                {props.children}
            </details>
        </div>
    )
}

function Command({ name, description, options, permissions }) {
    return (
        <li
            className="command"
            id="command-data"
            name={name}
            data-admin={permissions}
        >
            <a name={name} id={name} />
            <p className="name">{name}</p>
            <p className="hyphen"> - </p>
            <p className="desc">{description}</p>
            <span className="info">
                <p>{description}</p>
            </span>
        </li>
    )
}

function CommandList(props) {
    return (
        <F>
            {props.children.map((cs) => (
                <Item
                    className="sc"
                    key={cs.name}
                    name={cs.name}
                    description={cs.description}
                    openByDefault={false}
                >
                    <a name={cs.name} id={cs.name} />
                    <ul>
                        {cs.commands.cmds.map((command) => (
                            <F key={command.name}>
                                <Command {...command} />
                            </F>
                        ))}
                        {cs.commands.children && (
                            <CommandList children={cs.commands.children} />
                        )}
                    </ul>
                </Item>
            ))}
        </F>
    )
}

function Cpus(props) {
    return (
        <F>
            {<h4>Cpu: {props.cpu.model}</h4>}
            {
                <div className="usage">
                    <p>All: </p>
                    <div>
                        <span
                            style={{
                                width: Math.floor(
                                    (props.cpu.percent / 100) * 250
                                ),
                                backgroundColor: usageBarColor(
                                    props.cpu.percent
                                ),
                            }}
                        />
                    </div>
                    <p>{Math.floor(props.cpu.percent)}%</p>
                </div>
            }
            {props.cpu.cpus.map((c, i) => (
                <div className="usage" key={c + i}>
                    <p>Core {i}:</p>
                    <div>
                        <span
                            style={{
                                width: Math.floor((c.cpu / 100) * 250),
                                backgroundColor: usageBarColor(c.cpu),
                            }}
                        />
                    </div>
                    <p>{Math.floor(c.cpu)}%</p>
                </div>
            ))}
        </F>
    )
}

function Memory(props) {
    return (
        <F>
            {
                <h4>
                    Memory: {byteToData(props.memory.total - props.memory.free)}{" "}
                    / {byteToData(props.memory.total)}
                </h4>
            }
            {
                <div className="usage">
                    <p></p>
                    <div>
                        <span
                            style={{
                                width: Math.floor(
                                    (props.memory.percent / 100) * 250
                                ),
                                backgroundColor: usageBarColor(
                                    props.memory.percent
                                ),
                            }}
                        />
                    </div>
                    <p>{Math.floor(props.memory.percent)}%</p>
                </div>
            }
        </F>
    )
}

function Storage(props) {
    return (
        <F>
            {
                <h4>
                    Storage:{" "}
                    {byteToData(props.storage.total - props.storage.free)} /{" "}
                    {byteToData(props.storage.total)}
                </h4>
            }
            {
                <div className="usage">
                    <p></p>
                    <div>
                        <span
                            style={{
                                width: Math.floor(
                                    (props.storage.percent / 100) * 250
                                ),
                                backgroundColor: usageBarColor(
                                    props.storage.percent
                                ),
                            }}
                        />
                    </div>
                    <p>{Math.floor(props.storage.percent)}%</p>
                </div>
            }
        </F>
    )
}

function App() {
    const defaultHiState = {
        versions: {
            bot: ["", "", ""],
            discordjs: "",
            nodejs: "",
            os: ["", ""],
        },
        updateInfo: "",
        madeBy: "",
    }
    const defaultInfoState = {
        cpu: { model: "", cpus: [], percent: 0 },
        ram: { free: 0, total: 0, percent: 0 },
        storage: { free: 0, total: 0, percent: 0 },
        uptime: { os: 0, bot: 0 },
        servers: 0,
        users: 0,
        presence: { status: "", activities: "" },
    }
    const defaultCommandsState = {
        global: [{ data: { name: "no commands" } }],
        guild: [{ data: { name: "no commands" } }],
    }

    const [socket, setSocket] = useState(null)
    const [hi, setHi] = useState(defaultHiState)
    const [info, setInfo] = useState(defaultInfoState)
    const [commands, setCommands] = useState(defaultCommandsState)

    defineOnGlobal({ commands, info, hi })

    useEffect(() => {
        setSocket(io())
    }, [])
    useEffect(() => {
        if (!socket) return
        socket.on("commands", (data) => setCommands(data))
        socket.on("hi", (data) => setHi(data))
        socket.on("info", (data) => setInfo(data))
        socket.on("disconnect", () => {
            setHi(defaultHiState)
            setInfo(defaultInfoState)
            setCommands(defaultCommandsState)
        })
    }, [socket])

    return (
        <F>
            <div className="title">
                <h1>
                    <img
                        src="/src/img/cedbot-small.png"
                        width="34"
                        height="34"
                    />
                    Cedඞot
                </h1>
            </div>

            <div className="links">
                <a href="https://discord.gg/JkuB85n8yb">Join My Server.</a>
                <br />
                <a href="">Click here to invite a bot.</a>
                <br />
                <a href="https://twitter.com/fuji_ced">My Twitter</a>
            </div>

            <Item name="Info">
                <p>The bot is currently {info.presence.status}.</p>
                <p>It is currently running on {info.servers} servers.</p>
                <p>We are currently watching over {info.users} users.</p>

                <br />

                <div className="info-grid">
                    <h4>MadeBy: </h4>
                    <span className="madeby">
                        <span>
                            <p className="name">{hi.madeBy}</p>
                        </span>
                    </span>
                </div>

                <br />

                <div className="info-grid">
                    <h3>Versions: </h3>
                    <div>
                        <div className="version" id="bot">
                            <p className="name">CedBot:</p>
                            <p className="num">{hi.versions.bot[0]}</p>
                            <p className="build">
                                ({hi.versions.bot[1]} {hi.versions.bot[2]})
                            </p>
                        </div>
                        <div className="version" id="node">
                            <p className="name">Node.js:</p>
                            <p className="num">{hi.versions.nodejs}</p>
                        </div>
                        <div className="version" id="djs">
                            <p className="name">Discord.js:</p>
                            <p className="num">{hi.versions.discordjs}</p>
                        </div>
                        <div className="version" id="system">
                            <p className="name">System:</p>
                            <p className="num">{hi.versions.os[0]}</p>
                            <p className="build">{hi.versions.os[1]}</p>
                        </div>
                    </div>
                </div>

                <br />

                <div className="info-grid">
                    <h3>System: </h3>
                    <div>
                        <Cpus cpu={info.cpu} />
                        <Memory memory={info.ram} />
                        <Storage storage={info.storage} />
                        <div className="uptime">
                            <h4>Uptime: </h4>
                            <span>
                                <p>Server: {info.uptime.os}</p>
                                <p>Bot: {info.uptime.bot}</p>
                            </span>
                        </div>
                    </div>
                </div>

                <br />

                <div className="info-grid">
                    <h3>UpdateInfo: </h3>
                    <p>
                        {hi.updateInfo.split("\n").map((tx) => (
                            <F key={tx}>
                                {tx}
                                <br />
                            </F>
                        ))}
                    </p>
                </div>
            </Item>

            <Item name="Commands">
                <ul>
                    <h3>GlobalCommand: </h3>
                    {commands.global.map((command) => (
                        <Command key={command.data.name} {...command.data} />
                    ))}
                    <br />

                    <h3>GuildCommand: </h3>
                    {commands.guild.map((command) => (
                        <Command key={command.data.name} {...command.data} />
                    ))}
                </ul>
            </Item>
        </F>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
