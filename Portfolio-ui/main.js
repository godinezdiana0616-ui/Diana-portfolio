/* ----- NAVIGATION BAR FUNCTION ----- */
function myMenuFunction(){
    var menuBtn = document.getElementById("myNavMenu");

    if(menuBtn.className === "nav-menu"){
      menuBtn.className += " responsive";
    } else {
      menuBtn.className = "nav-menu";
    }
}

/* ----- ADD SHADOW ON NAVIGATION BAR WHILE SCROLLING ----- */
function headerShadow() {
    const navHeader = document.getElementById("header");

    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      navHeader.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.1)";
      navHeader.style.height = "70px";
      navHeader.style.lineHeight = "70px";
    } else {
      navHeader.style.boxShadow = "none";
      navHeader.style.height = "90px";
      navHeader.style.lineHeight = "90px";
    }
}

/* ----- TYPING EFFECT ----- */
var typingEffect = new Typed(".typedText",{
    strings : ["Designer","Developer","Freelancer","Technical Writer "],
    loop : true,
    typeSpeed : 85, 
    backSpeed : 10,
    backDelay : 2000
})

/* ----- ## -- SCROLL REVEAL ANIMATION -- ## ----- */
const sr = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 2000,
        reset: false   
})

/* -- HOME -- */
sr.reveal('.featured-text-card',{})
sr.reveal('.featured-name',{delay: 100})
sr.reveal('.featured-text-info',{delay: 200})
sr.reveal('.featured-text-btn',{delay: 200})
sr.reveal('.social_icons',{delay: 200})
sr.reveal('.featured-image',{delay: 300})

/* -- PROJECT BOX -- */
sr.reveal('.project-box',{interval: 200})

/* -- HEADINGS -- */
sr.reveal('.top-header',{})

/* ----- ## -- SCROLL REVEAL LEFT_RIGHT ANIMATION -- ## ----- */
const srLeft = ScrollReveal({
  origin: 'left',
  distance: '80px',
  duration: 2000,
  reset: false
})
srLeft.reveal('.about-info',{delay: 100})
srLeft.reveal('.contact-info',{delay: 100})

const srRight = ScrollReveal({
  origin: 'right',
  distance: '80px',
  duration: 2000,
  reset: false
})
srRight.reveal('.skills-box',{delay: 100})
srRight.reveal('.form-control',{delay: 100})

/* ----- CHANGE ACTIVE LINK ----- */
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
  const scrollY = window.scrollY;

  sections.forEach(current =>{
    const sectionHeight = current.offsetHeight,
          sectionTop = current.offsetTop - 50,
          sectionId = current.getAttribute('id')

    const activeNavLink = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
    if (activeNavLink) {
        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) { 
          activeNavLink.classList.add('active-link')
        } else {
          activeNavLink.classList.remove('active-link')
        }
    }
  })
}

// Global scroll integration
window.addEventListener('scroll', () => {
    headerShadow();
    scrollActive();
});


/* ----- PORTFOLIO AI CHATBOT SYSTEM ----- */
// Idinedeklara ang variables sa labas para magamit din sa loob ng sendMessage()
let chatInput, chatMessages;

document.addEventListener("DOMContentLoaded", function () {
    const triggerBtn = document.getElementById('chat-trigger-btn');
    const chatWindow = document.getElementById('chat-window');
    const sendBtn = document.getElementById('send-btn');
    chatInput = document.getElementById('chat-input');
    chatMessages = document.getElementById('chat-messages');

    // ISANG MALINIS NA EVENT LISTENER LANG PARA SA PAGBUKAS/PAGSARA
    if (triggerBtn && chatWindow) {
        triggerBtn.addEventListener('click', function() {
            chatWindow.classList.toggle('hidden');
        });
    }

    // LISTENER PARA SA PAGPAPADALA NG MENSAHE
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => { 
            if(e.key === 'Enter') sendMessage(); 
        });
    }
});

// ANG SEPARATE ASYNC FUNCTION MO PARA SA CHAT WEB LOGIC
async function sendMessage() {
    const text = chatInput.value.trim();
    if(!text) return;

    // Isulat ang text ng user sa UI chat box
    appendMessage(text, 'user-msg');
    chatInput.value = '';

    try {
        // TATAWAGAN ANG JAVA GATEWAY 
        // Direktang ituro muna sa Python para sa testing:
        const response = await fetch('http://localhost:8080/api/portfolio-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        // DAGDAG NA CHECK
        if (!response.ok) {
            appendMessage(`Server error: ${response.status} - ${response.statusText}`, 'bot-msg');
            return;
        }

        const data = await response.json();

        if (data && data.response) {
            appendMessage(data.response, 'bot-msg');
        } else if (data && data.error) {
            appendMessage("Error: " + data.error, 'bot-msg');
        } else {
            appendMessage("Sorry, I didn't get a proper response.", 'bot-msg');
        }
    } catch (error) {
        appendMessage("Sorry, I'm having trouble connecting to the backend server.", 'bot-msg');
    }
}

function appendMessage(msg, className) {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = className;
    div.innerText = msg;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll pababa
}