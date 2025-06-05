"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

function RudeGPTChat() {
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

  // Update progress bar color based on rage level
  useEffect(() => {
    const progressBar = document.querySelector(".progress-bar")
    if (progressBar) {
      if (rageLevel >= 95) {
        progressBar.style.background = "linear-gradient(90deg, #ff0000 0%, #ff3333 50%, #ff0000 100%)"
        progressBar.style.boxShadow = "0 0 10px #ff0000"
      } else if (rageLevel > 80) {
        progressBar.style.background = "linear-gradient(90deg, #ff3333 0%, #ff6666 50%, #ff3333 100%)"
      } else if (rageLevel > 60) {
        progressBar.style.background = "linear-gradient(90deg, #cc3333 0%, #ff5555 50%, #cc3333 100%)"
      } else {
        progressBar.style.background = "linear-gradient(90deg, #993333 0%, #cc4444 50%, #993333 100%)"
      }
      progressBar.style.width = rageLevel + "%"
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
        setTimeout(() => {
          window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")
          addMessage("rudegpt", "Bored? Here's some entertainment! You've been idle-rolled! 🎵")
        }, 500)
        return
      }

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "IDLE_TIMEOUT",
            rageLevel,
            currentMood: mood,
          }),
        })

        const data = await response.json()

        if (data.response) {
          setIsTyping(true)
          setTimeout(() => {
            setIsTyping(false)
            addMessage("rudegpt", data.response)

            if (data.rageIncrease) {
              setRageLevel((prev) => Math.min(100, prev + data.rageIncrease))
            }
            if (data.newMood) {
              setMood(data.newMood)
            }
          }, 1200)
        }
      } catch (error) {
        // Fallback to original idle behavior
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          const idleComments = [
            "Still there? I was hoping you'd given up by now.",
            "Hello? Earth to human. Did your brain finally crash?",
            "I'm getting bored. Say something stupid to entertain me.",
          ]
          addMessage("rudegpt", idleComments[Math.floor(Math.random() * idleComments.length)])
          setRageLevel((prev) => Math.min(100, prev + 5))
        }, 1200)
      }
    }, 15000)
  }

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }])
  }

  const getFallbackResponse = () => {
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

    // Disable input and button while processing
    setIsDisabled(true)
    addMessage("user", message)
    setInputValue("")
    resetIdleTimer()
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
        }),
      })

      const data = await response.json()
      setIsTyping(false)

      if (data.response) {
        addMessage("rudegpt", data.response)

        if (data.rageIncrease) {
          setRageLevel((prev) => Math.min(100, prev + data.rageIncrease))
        }
        if (data.newMood) {
          setMood(data.newMood)
        }

        // Check for rickroll - both AI-triggered and random
        const shouldRickroll = data.action === "rickroll" || (Math.random() < rickrollChance && message.length > 5)

        if (shouldRickroll) {
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
    resetIdleTimer()

    // Console easter eggs
    console.log("%cRudeGPT System Initialized", "color: #ff4444; font-size: 16px; font-weight: bold;")
    console.log("%cWarning: Maximum sass levels detected", "color: #cc3333; font-size: 12px;")
    console.log('%cType "rudegpt.getBored()" in console for a surprise...', "color: #666666; font-size: 10px;")

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
    }

    return () => {
      clearTimeout(idleTimerRef.current)
    }
  }, [])

  return (
    <div className="retro-container">
      <div className="title-bar">
        <div>
          <span
            className="title-text"
            style={titleText !== "RudeGPT" ? { color: "#ff4444", textShadow: "2px 2px 4px rgba(255, 0, 0, 0.8)" } : {}}
          >
            {titleText}
          </span>
          <span className="mood-text">{mood}</span>
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

export default function LandingPage() {
  const [warningAccepted, setWarningAccepted] = useState(false)

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="logo-section">
          <h1 className="main-logo">
            <span className="glitch-text" data-text="RudeGPT">
              RudeGPT
            </span>
          </h1>
          <p className="tagline">The only AI that hates you.</p>
        </div>

        <div className="warning-box">
          <div className="warning-header">⚠️ WARNING ⚠️</div>
          <div className="warning-content">
            <p>This AI is programmed to be:</p>
            <ul>
              <li>🔥 Extremely rude and sarcastic</li>
              <li>💀 Completely unhelpful</li>
              <li>🎯 Designed to roast you mercilessly</li>
              <li>🚪 Capable of ejecting you at any time</li>
            </ul>
            <p className="warning-footer">
              <strong>You have been warned.</strong>
              <br />
              Proceed at your own risk.
            </p>
          </div>
        </div>

        <div className="disclaimer">
          <label className="checkbox-container">
            <input type="checkbox" checked={warningAccepted} onChange={(e) => setWarningAccepted(e.target.checked)} />
            <span className="checkmark"></span>I understand this AI will be mean to me and I'm okay with that
          </label>
        </div>

        <div className="action-buttons">
          <Link href="/chat">
            <button className={`enter-btn ${!warningAccepted ? "disabled" : ""}`} disabled={!warningAccepted}>
              → Get Roasted
            </button>
          </Link>
          <button className="chicken-btn" onClick={() => alert("Smart choice. This AI shows no mercy.")}>
            🐔 I'm Too Scared
          </button>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Anti-Helpful</h3>
            <p>Refuses to answer anything useful. Specializes in creative insults.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">😈</div>
            <h3>Rage Meter</h3>
            <p>Watch the AI get angrier with every message. Ejection imminent.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎵</div>
            <h3>Surprise Rickrolls</h3>
            <p>Random rickrolls when you least expect them. You've been warned.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚪</div>
            <h3>Instant Ejection</h3>
            <p>AI can kick you out mid-conversation. No appeals process.</p>
          </div>
        </div>

        <footer className="landing-footer">
          <p>Built with maximum sass • Not responsible for hurt feelings</p>
        </footer>
      </div>
    </div>
  )
}
