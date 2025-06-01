// script.js

document.addEventListener("DOMContentLoaded", () => {
  // =================================================================================
  // **אלמנט שלא למדנו בכיתה: localStorage**
  // localStorage מאפשר לנו לשמור נתונים (key-value) בדפדפן בין רענונים וסגירות
  // כאן נשמור flag "hasPlayed" כדי לדעת אם המוזיקה כבר שולבה
  // =================================================================================

  // מפה של אובייקטי Audio (צלילים של החיות)
  const sounds = {
    croc: new Audio("audio/croc.mp3"),
    dolphin: new Audio("audio/dolphin.mp3"),
    frog: new Audio("audio/frog.mp3"),
    lion: new Audio("audio/lion.mp3"),
    snake: new Audio("audio/snake.mp3"),
    buffalo: new Audio("audio/buffalo.mp3"),
    hippo: new Audio("audio/hippo.mp3"),
  };

  // טוען מראש את כל קבצי ה־Audio במפה
  Object.values(sounds).forEach(audioObj => audioObj.load());

  // דוגמה לשימוש ב־localStorage:
  // מפעיל מוזיקה רק בפעם הראשונה שהמשתמש נכנס לעמוד
  function hasMusicPlayedBefore() {
    return localStorage.getItem("hasPlayed") === "true";
  }
  function markMusicAsPlayed() {
    localStorage.setItem("hasPlayed", "true");
  }

  // אודיו רקע (פעמיים)
  const bgMusic = new Audio("audio/lions_sleep_tonight.mp3");
  bgMusic.volume = 0.7;

  if (!hasMusicPlayedBefore()) {
    bgMusic.play()
      .then(() => {
        console.log("השמענו lions_sleep_tonight.mp3 בפעם הראשונה");
        markMusicAsPlayed();
      })
      .catch(err => {
        console.warn("Autoplay נחסם:", err);
        // במידה ונחסם, ניתן להציג כפתור Play למשתמש (לא ממומש כאן)
      });
  } else {
    console.log("המוזיקה כבר שוחקה בעבר, נמנעים מאוטופליי");
  }

  // =================================================================================
  // פונקציה מרכזית לניגון צליל של חיה:
  // =================================================================================
  function handleAnimalSelection(animal) {
    if (!sounds[animal]) {
      alert(`שגיאה: לא נמצאה חיה בשם "${animal}".`);
      return;
    }
    const audio = sounds[animal];
    audio.volume = 1.0;       // עוצמת רוחב מלא
    audio.currentTime = 0;    // משחק מתחילת הקובץ

    audio.play()
      .then(() => {
        // לאחר 5 שניות, השתקה של הווליום (mute)
        setTimeout(() => {
          audio.volume = 0;
        }, 5000);
      })
      .catch(err => {
        console.warn(`שגיאה בניגון ${animal}:`, err);
        alert(`שגיאה בניגון "${animal}".`);
      });
  }

  // =================================================================================
  // הוספת מאזינים לכל הכפתורים:
  // - לחיצה עם העכבר
  // =================================================================================
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("animal")) {
        const img = btn.querySelector("img");
        const animal = img && img.alt ? img.alt.toLowerCase() : null;
        if (animal) {
          handleAnimalSelection(animal);
        } else {
          alert("שגיאה: לכפתור ה־animal אין תמונה תקינה עם alt.");
        }
      } else {
        alert("שגיאה: לחצת על כפתור שלא מתאים לבחירת חיה.");
      }
    });
  });

  // =================================================================================
  // מאזין ללחיצות מקלדת:
  // =================================================================================
  document.addEventListener("keydown", event => {
    const pressedKey = event.key.toLowerCase();
    const matchingBtn = document.querySelector(`button.animal.${pressedKey}`);
    if (matchingBtn) {
      const img = matchingBtn.querySelector("img");
      const animal = img && img.alt ? img.alt.toLowerCase() : null;
      if (animal) {
        handleAnimalSelection(animal);
      } else {
        alert("שגיאה: כפתור ה־animal אין לו תמונה תקינה עם alt.");
      }
      // אפקט ויזואלי קצר
      matchingBtn.classList.add("active");
      setTimeout(() => matchingBtn.classList.remove("active"), 150);
    } else {
      alert(`שגיאה: אין חיה מקושרת למקש "${pressedKey}".`);
    }
    event.preventDefault();
  });
});
