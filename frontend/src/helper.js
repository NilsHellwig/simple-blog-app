// Exportiere eine Funktion als Konstante namens convertUnixToTimestamp, die einen Unix-Timestamp als Eingabe erhält
export const convertUnixToTimestamp = (unixTimestamp) => {
  // Erstelle ein Date-Objekt aus dem Unix-Timestamp
  // Multipliziere mit 1000, da JavaScript Date Millisekunden erwartet, Unix-Timestamps aber in Sekunden angegeben sind
  const date = new Date(unixTimestamp * 1000);
  
  // Verwandle das Date-Objekt in einen lokal formatierten String mit deutschem Datumsformat
  // Verwende toLocaleDateString mit folgenden Optionen:
  return date.toLocaleDateString("de-DE", {
    year: "numeric", // Ausgabe des Jahres als vierstellige Zahl, z.B. "2025"
    month: "long",   // Ausgabe des Monats als vollständiges Wort, z.B. "Juni"
    day: "numeric",  // Ausgabe des Tages als Zahl ohne führende Null, z.B. "29"
    hour: "2-digit", // Ausgabe der Stunde mit führender Null falls nötig, z.B. "08" oder "17"
    minute: "2-digit", // Ausgabe der Minute mit führender Null falls nötig, z.B. "05" oder "42"
  });
  // Gibt einen String zurück, z.B. "29. Juni 2025, 17:42"
};
