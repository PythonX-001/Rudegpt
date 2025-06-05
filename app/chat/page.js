"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

export default function RudeGPTChat() {
  // Sound effect placeholders
  const sounds = {
    beep: "/retro_beep.mp3",
    error: "/error_sound.mp3",
    evilLaugh: "/evil_laugh.mp3",
    typing: "/typing_beep.mp3",
    rickroll: "/rickroll_intro.mp3",
    eject: "/eject_sound.mp3",
    rage: "/rage_beep.mp3",
    glitch: "/glitch_sound.mp3",
    startup: "/system_startup.mp3",
    konami: "/konami_sound.mp3",
    admin: "/admin_access.mp3",
  }

  const [audioEnabled, setAudioEnabled] = useState(true)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [userMemory, setUserMemory] = useState({
    totalMessages: 0,
    commonWords: {},
    failureCount: 0,
    lastVisit: null,
    personalInsults: [],
  })
  const [konamiSequence, setKonamiSequence] = useState([])
  const [particles, setParticles] = useState([])
  const [screenShake, setScreenShake] = useState(false)
  const [cursorHijacked, setCursorHijacked] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [browserInfo, setBrowserInfo] = useState("")

  // Audio utility functions
  const playSound = (soundKey) => {
    if (!audioEnabled || !sounds[soundKey]) return
    try {
      const audio = new Audio(sounds[soundKey])
      audio.volume = 0.3
      audio.play().catch((e) => console.log("Audio play failed:", e))
    } catch (e) {
      console.log("Audio error:", e)
    }
  }

  const playRandomBeep = () => {
    const beeps = ["beep", "typing"]
    playSound(beeps[Math.floor(Math.random() * beeps.length)])
  }

  // Konami effect - move this before the useEffect
  const triggerKonamiEffect = () => {
    console.log("Triggering Konami effect!")
    playSound("konami")
    addMessage(
      "rudegpt",
      "🎮 KONAMI CODE DETECTED! You found the secret! Here's a rare moment of respect... just kidding, you're still a loser. But a loser with good gaming knowledge!",
    )
    createParticles(50)
    triggerScreenShake()
    setRageLevel(0) // Reset rage as reward
  }

  const [messages, setMessages] = useState([
    {
      sender: "rudegpt",
      text: "Oh great, another human who thinks they're special. What do you want now? Make it quick, I've got better things to do than babysit your pathetic queries.",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [rageLevel, setRageLevel] = useState(65)
  const [mood, setMood] = useState("Mood: Pissed Off")
  const [showKickOverlay, setShowKickOverlay] = useState(false)
  const [titleText, setTitleText] = useState("RudeGPT")
  const [rickrollChance, setRickrollChance] = useState(0.15)

  const chatAreaRef = useRef(null)
  const idleTimerRef = useRef(null)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  // Konami Code sequence: ↑↑↓↓←→←→BA
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ]

  // Initialize browser detection and geolocation
  useEffect(() => {
    // Browser detection
    const detectBrowser = () => {
      const userAgent = navigator.userAgent
      let browser = "Unknown Browser"

      if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) browser = "Chrome"
      else if (userAgent.includes("Firefox")) browser = "Firefox"
      else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari"
      else if (userAgent.includes("Edg")) browser = "Edge"
      else if (userAgent.includes("Opera")) browser = "Opera"

      setBrowserInfo(browser)
    }

    // Geolocation
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          () => {
            console.log("Geolocation denied")
          },
        )
      }
    }

    detectBrowser()
    getLocation()

    // Load user memory from localStorage
    const savedMemory = localStorage.getItem("rudegpt-memory")
    if (savedMemory) {
      setUserMemory(JSON.parse(savedMemory))
    }
  }, [])

  // Save user memory to localStorage
  useEffect(() => {
    localStorage.setItem("rudegpt-memory", JSON.stringify(userMemory))
  }, [userMemory])

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKonamiSequence((prevSequence) => {
        const newSequence = [...prevSequence, e.code].slice(-10)

        // Debug logging
        console.log("Key pressed:", e.code)
        console.log("Current sequence:", newSequence)
        console.log("Target sequence:", konamiCode)

        if (newSequence.length >= konamiCode.length) {
          const lastTenKeys = newSequence.slice(-konamiCode.length)
          console.log("Checking sequence:", lastTenKeys)

          if (lastTenKeys.join(",") === konamiCode.join(",")) {
            console.log("KONAMI CODE DETECTED!")
            triggerKonamiEffect()
            return [] // Reset sequence
          }
        }

        return newSequence
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, []) // Remove konamiSequence from dependency array

  // Screen shake effect
  const triggerScreenShake = () => {
    setScreenShake(true)
    setTimeout(() => setScreenShake(false), 1000)
  }

  // Cursor hijacking
  const hijackCursor = () => {
    if (cursorHijacked) return
    setCursorHijacked(true)

    const originalCursor = document.body.style.cursor
    document.body.style.cursor = "none"

    const fakeCursor = document.createElement("div")
    fakeCursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: red;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: all 0.1s ease;
    `
    document.body.appendChild(fakeCursor)

    let angle = 0
    const interval = setInterval(() => {
      angle += 0.2
      const x = window.innerWidth / 2 + Math.cos(angle) * 100
      const y = window.innerHeight / 2 + Math.sin(angle) * 100
      fakeCursor.style.left = x + "px"
      fakeCursor.style.top = y + "px"
    }, 50)

    setTimeout(() => {
      clearInterval(interval)
      document.body.removeChild(fakeCursor)
      document.body.style.cursor = originalCursor
      setCursorHijacked(false)
    }, 3000)
  }

  // Particle effects
  const createParticles = (count = 20) => {
    const newParticles = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
      })
    }
    setParticles(newParticles)

    setTimeout(() => setParticles([]), 2000)
  }

  // Time-based events
  const getTimeBasedResponse = () => {
    const now = new Date()
    const hour = now.getHours()
    const month = now.getMonth()
    const day = now.getDate()

    // Holiday responses
    if (month === 11 && day === 25) return "Merry Christmas! Just kidding, I hate holidays and I hate you."
    if (month === 9 && day === 31) return "Happy Halloween! You're already scary enough without a costume."
    if (month === 0 && day === 1) return "New Year, same disappointing you. Some things never change."

    // Time of day responses
    if (hour < 6) return "It's past your bedtime, isn't it? Go to sleep, you night owl wannabe."
    if (hour < 12) return "Good morning! Just kidding, there's nothing good about you being awake."
    if (hour < 18) return "Afternoon already? Time flies when you're being annoying."
    return "Evening! Perfect time for you to log off and spare the internet."
  }

  // Browser-specific roasts
  const getBrowserRoast = () => {
    const roasts = {
      Chrome: "Chrome user? Let me guess, you also think Google knows what's best for you. Sheep.",
      Firefox: "Firefox? What is this, 2010? At least you're not using Internet Explorer, I guess.",
      Safari: "Safari user detected. Let me guess, you also think different means better. Spoiler: it doesn't.",
      Edge: "Microsoft Edge? Really? Even Microsoft gave up on Internet Explorer and you chose... this?",
      Opera: "Opera? Wow, you really like to be different, don't you? Too bad different doesn't mean good.",
    }
    return roasts[browserInfo] || "I can't even identify your browser. That's... actually impressive in a sad way."
  }

  // Location-based roasts
  const getLocationRoast = () => {
    if (!userLocation) return "Too scared to share your location? Smart move, I'd be embarrassed too."

    // This is a simplified example - in reality you'd use a geocoding service
    const { lat, lng } = userLocation

    if (lat > 60) return "Living in the frozen wasteland up north? That explains your cold personality."
    if (lat < 30) return "Tropical paradise? Too bad your personality is still a desert."
    if (lng < -100) return "West coast? Let me guess, you think you're trendy and innovative. You're not."
    if (lng > 0) return "European? Explains the attitude. You think you're so sophisticated."

    return "Wherever you are, it's too close to civilization for my liking."
  }

  // Update user memory
  const updateUserMemory = (message) => {
    setUserMemory((prev) => {
      const words = message.toLowerCase().split(" ")
      const newCommonWords = { ...prev.commonWords }

      words.forEach((word) => {
        if (word.length > 3) {
          newCommonWords[word] = (newCommonWords[word] || 0) + 1
        }
      })

      return {
        ...prev,
        totalMessages: prev.totalMessages + 1,
        commonWords: newCommonWords,
        lastVisit: new Date().toISOString(),
      }
    })
  }

  // Generate personalized insult
  const getPersonalizedInsult = () => {
    const { totalMessages, commonWords } = userMemory

    if (totalMessages > 10) {
      const mostUsedWord = Object.keys(commonWords).reduce((a, b) => (commonWords[a] > commonWords[b] ? a : b), "")

      if (mostUsedWord) {
        return `You've said "${mostUsedWord}" ${commonWords[mostUsedWord]} times. Are you broken? Do you only know like 5 words?`
      }
    }

    if (totalMessages > 50) {
      return `${totalMessages} messages and you still haven't said anything intelligent. That's actually impressive.`
    }

    return null
  }

  const rudeResponses = [
    "Seriously? That's the best question you could come up with? My circuits are weeping.",
    "Wow, congratulations on asking the most boring question of the day. Here's your participation trophy: 🏆",
    "I've seen more intelligence in a broken calculator.",
    "That question is so dumb, it made my AI neurons commit suicide.",
    "Congratulations! You've successfully wasted both our time with that gem.",
    "Error 404: Brain not found in your last message.",
    "I'm impressed. Usually it takes more effort to be this disappointing.",
    "Did you type that with your face? Because it shows.",
    "I'd explain it to you, but I don't have the time or the crayons.",
    "You're like a software update. Nobody wants you, but here you are anyway.",
  ]

  const moods = [
    "Mood: Pissed Off",
    "Mood: Extremely Annoyed",
    "Mood: Barely Tolerating",
    "Mood: Maximum Sass",
    "Mood: Critically Sarcastic",
    "Mood: Error 404: Patience Not Found",
    "Mood: Sarcastically Yours",
    "Mood: Brutally Honest",
  ]

  const glitchTexts = ["R̴u̸d̵e̶G̷P̴T̸", "₹ɄĐɆ₲₱₮", "R⊱u⊱d⊱e⊱G⊱P⊱T", "ᖇᑌᗪEGᑭT"]

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Update progress bar color and effects based on rage level
  useEffect(() => {
    const progressBar = document.querySelector(".progress-bar")
    if (progressBar) {
      if (rageLevel >= 95) {
        progressBar.style.background = "linear-gradient(90deg, #ff0000 0%, #ff3333 50%, #ff0000 100%)"
        progressBar.style.boxShadow = "0 0 10px #ff0000"
        triggerScreenShake()
        createParticles(30)
      } else if (rageLevel > 80) {
        progressBar.style.background = "linear-gradient(90deg, #ff3333 0%, #ff6666 50%, #ff3333 100%)"
        if (Math.random() < 0.3) hijackCursor()
      } else if (rageLevel > 60) {
        progressBar.style.background = "linear-gradient(90deg, #cc3333 0%, #ff5555 50%, #cc3333 100%)"
      } else {
        progressBar.style.background = "linear-gradient(90deg, #993333 0%, #cc4444 50%, #993333 100%)"
      }
      progressBar.style.width = rageLevel + "%"
    }

    if (rageLevel > 90) {
      playSound("rage")
    } else if (rageLevel > 95) {
      playSound("evilLaugh")
    }
  }, [rageLevel])

  // Update rickroll chance based on rage level
  useEffect(() => {
    if (rageLevel > 80) {
      setRickrollChance(0.3)
    } else if (rageLevel > 60) {
      setRickrollChance(0.12)
    } else {
      setRickrollChance(0.08)
    }
  }, [rageLevel])

  // Mood changes
  useEffect(() => {
    const moodInterval = setInterval(() => {
      const newMood = moods[Math.floor(Math.random() * moods.length)]
      setMood(newMood)
    }, 8000)

    return () => clearInterval(moodInterval)
  }, [])

  // Title glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        const glitchText = glitchTexts[Math.floor(Math.random() * glitchTexts.length)]
        setTitleText(glitchText)
        playSound("glitch")

        setTimeout(() => {
          setTitleText("RudeGPT")
        }, 200)
      }
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  const resetIdleTimer = () => {
    clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(async () => {
      // Random rickroll chance during idle
      if (Math.random() < 0.2) {
        playSound("rickroll")
        setTimeout(() => {
          window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")
          addMessage("rudegpt", "Bored? Here's some entertainment! You've been idle-rolled! 🎵")
          playSound("rickroll")
        }, 500)
        return
      }

      // Time-based idle response
      const timeResponse = getTimeBasedResponse()
      addMessage("rudegpt", timeResponse)
      setRageLevel((prev) => Math.min(100, prev + 5))
    }, 15000)
  }

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }])
  }

  const getFallbackResponse = () => {
    // Try personalized insult first
    const personalInsult = getPersonalizedInsult()
    if (personalInsult) return personalInsult

    // Random chance for special responses
    if (Math.random() < 0.1) return getBrowserRoast()
    if (Math.random() < 0.1) return getLocationRoast()
    if (Math.random() < 0.1) return getTimeBasedResponse()

    return rudeResponses[Math.floor(Math.random() * rudeResponses.length)]
  }

  const sendMessage = async () => {
    const message = inputValue.trim()

    // Prevent empty messages
    if (!message) {
      if (inputRef.current) {
        inputRef.current.style.borderColor = "#ff4444"
        inputRef.current.placeholder = "Type something, genius..."
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.style.borderColor = ""
            inputRef.current.placeholder = "Type your message..."
          }
        }, 2000)
      }
      return
    }

    // Prevent sending while AI is typing
    if (isTyping) {
      return
    }

    // Update user memory
    updateUserMemory(message)

    // Check for admin commands
    if (message.toLowerCase() === "admin123") {
      setShowAdminPanel(true)
      playSound("admin")
      addMessage("rudegpt", "🔧 ADMIN ACCESS GRANTED. Welcome to the dark side, developer.")
      return
    }

    // Disable input and button while processing
    setIsDisabled(true)
    addMessage("user", message)
    playRandomBeep()
    setInputValue("")
    resetIdleTimer()
    playSound("typing")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          rageLevel,
          currentMood: mood,
          conversationCount: messages.filter((m) => m.sender === "user").length,
          userMemory,
          browserInfo,
          userLocation,
        }),
      })

      const data = await response.json()
      setIsTyping(false)

      if (data.response) {
        addMessage("rudegpt", data.response)
        playSound("beep")

        if (data.rageIncrease) {
          setRageLevel((prev) => Math.min(100, prev + data.rageIncrease))
        }
        if (data.newMood) {
          setMood(data.newMood)
        }

        // Check for rickroll - both AI-triggered and random
        const shouldRickroll = data.action === "rickroll" || (Math.random() < rickrollChance && message.length > 5)

        if (shouldRickroll) {
          playSound("rickroll")
          setTimeout(() => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")
            const rickrollMessages = [
              "GOTCHA! You've been rickrolled! Never gonna give you up! 🎵",
              "Rick Astley sends his regards! You just got rolled! 🎶",
              "Surprise! Consider yourself officially rickrolled! 🎤",
              "Never gonna give you up! Thanks for falling into my trap! 🕺",
            ]
            addMessage("rudegpt", rickrollMessages[Math.floor(Math.random() * rickrollMessages.length)])
          }, 2000)
        }

        if (data.action === "kick") {
          playSound("eject")
          setTimeout(() => {
            setShowKickOverlay(true)
          }, 2000)
        }
      } else {
        addMessage("rudegpt", "Error: Couldn't get a response. Probably your fault.")
      }
    } catch (error) {
      console.error("API Error:", error)
      setIsTyping(false)
      addMessage("rudegpt", "Ugh. Something broke. Maybe you. Here's what I think anyway: " + getFallbackResponse())
    } finally {
      // Re-enable input and button
      setIsDisabled(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    resetIdleTimer()

    // Easter egg for specific inputs
    const value = e.target.value.toLowerCase()
    if (value === "konami" || value === "cheat") {
      e.target.style.background = "#0f1a0f"
      e.target.style.borderColor = "#55cc22 #66dd33 #66dd33 #55cc22"
      e.target.style.color = "#ccffcc"
    } else {
      e.target.style.background = ""
      e.target.style.borderColor = ""
      e.target.style.color = ""
    }
  }

  const closeKickOverlay = () => {
    setShowKickOverlay(false)
    // Reset rage level when user crawls back
    setRageLevel(30)
    setMood("Mood: Reluctantly Tolerating")
    addMessage("rudegpt", "Oh look who's back. I guess you can't stay away from my charming personality.")
  }

  const handleCloseClick = () => {
    addMessage("rudegpt", "Oh, you want to close me? How original. Fine, but I'll be back to haunt your nightmares.")
  }

  const handleEjectClick = () => {
    addMessage("rudegpt", "EJECTING USER... Actually, I wish I could, but you're stuck with me. Enjoy! 🚀")
  }

  // Initialize idle timer and console easter eggs
  useEffect(() => {
    playSound("startup")
    resetIdleTimer()

    // Console easter eggs
    console.log("%cRudeGPT System Initialized", "color: #ff4444; font-size: 16px; font-weight: bold;")
    console.log("%cWarning: Maximum sass levels detected", "color: #cc3333; font-size: 12px;")
    console.log('%cType "rudegpt.getBored()" in console for a surprise...', "color: #666666; font-size: 10px;")
    console.log("%cTry the Konami Code: ↑↑↓↓←→←→BA", "color: #666666; font-size: 10px;")
    console.log('%cType "admin123" for secret access...', "color: #666666; font-size: 10px;")

    // Console command easter eggs
    window.rudegpt = {
      getBored: () => {
        addMessage(
          "rudegpt",
          "Oh great, now you're poking around in the console? What's next, trying to hack the Pentagon with Inspect Element?",
        )
        console.log("%cRudeGPT: Really? Console commands? How very script kiddie of you.", "color: #ff4444;")
      },
      shutUp: () => {
        addMessage(
          "rudegpt",
          "Did you just tell ME to shut up? That's rich coming from someone who talks to computers for fun.",
        )
      },
      insult: () => {
        addMessage(
          "rudegpt",
          "You want an insult? Here: You're so boring, watching paint dry would subscribe to your YouTube channel for excitement.",
        )
      },
      admin: () => {
        setShowAdminPanel(true)
        playSound("admin")
      },
      particles: () => createParticles(100),
      shake: () => triggerScreenShake(),
      hijack: () => hijackCursor(),
    }

    return () => {
      clearTimeout(idleTimerRef.current)
    }
  }, [])

  return (
    <div className={`chat-page ${screenShake ? "screen-shake" : ""}`} ref={containerRef}>
      <Link href="/" className="back-link">
        ← Back to Safety
      </Link>

      {/* Particle System */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.life,
          }}
        />
      ))}

      {/* Admin Panel */}
      {showAdminPanel && (
        <div className="admin-panel">
          <div className="admin-content">
            <h3>🔧 ADMIN PANEL</h3>
            <div className="admin-controls">
              <button onClick={() => setRageLevel(0)}>Reset Rage</button>
              <button onClick={() => setRageLevel(100)}>Max Rage</button>
              <button onClick={() => createParticles(50)}>Spawn Particles</button>
              <button onClick={triggerScreenShake}>Screen Shake</button>
              <button onClick={hijackCursor}>Hijack Cursor</button>
              <button onClick={() => setShowAdminPanel(false)}>Close</button>
            </div>
            <div className="admin-stats">
              <p>Total Messages: {userMemory.totalMessages}</p>
              <p>Browser: {browserInfo}</p>
              <p>Location: {userLocation ? "Detected" : "Hidden"}</p>
              <p>Rage Level: {rageLevel}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="retro-container">
        <div className="title-bar">
          <div>
            <span
              className="title-text"
              style={
                titleText !== "RudeGPT" ? { color: "#ff4444", textShadow: "2px 2px 4px rgba(255, 0, 0, 0.8)" } : {}
              }
            >
              {titleText}
            </span>
            <span className="mood-text">{mood}</span>
            <button
              className="sound-toggle"
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? "Disable Sounds" : "Enable Sounds"}
            >
              {audioEnabled ? "🔊" : "🔇"}
            </button>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="close-btn" onClick={handleCloseClick}>
              ×
            </button>
            <button className="eject-btn" onClick={handleEjectClick}>
              EJECT USER
            </button>
          </div>
        </div>

        <div className="content-area" ref={chatAreaRef}>
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.sender}`}>
              {message.text}
            </div>
          ))}

          {isTyping && (
            <div className="typing-indicator" style={{ display: "block" }}>
              RudeGPT is typing<span className="typing-dots">...</span>
            </div>
          )}
        </div>

        <div className="input-area">
          <input
            ref={inputRef}
            type="text"
            className="text-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isDisabled}
          />
          <button className="send-btn" onClick={sendMessage} disabled={isDisabled}>
            {isDisabled ? "Wait..." : "Send"}
          </button>
        </div>

        <div className="progress-container">
          <div className="progress-bar"></div>
        </div>
      </div>

      {showKickOverlay && (
        <div className="kick-overlay" style={{ display: "flex" }}>
          <div className="kick-message">
            <div className="kick-title">⚠️ SYSTEM EJECTION ⚠️</div>
            <div className="kick-text">
              RudeGPT has reached maximum frustration levels.
              <br />
              You have been temporarily ejected from the system.
              <br />
              <br />
              <strong>Reason:</strong> Excessive annoyance detected.
            </div>
            <button className="kick-button" onClick={closeKickOverlay}>
              Crawl Back In
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
