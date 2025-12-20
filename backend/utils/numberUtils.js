export default function convertNumberToWords(num) {
    if (num === 0) return "zero";

    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const thousands = ["", "Thousand", "Lakh", "Crore"];

    function convertHundred(num) {
        let hundred = Math.floor(num / 100);
        let remainder = num % 100;
        let str = "";

        if (hundred > 0) {
            str += units[hundred] + " Hundred ";
        }
        if (remainder > 10 && remainder < 20) {
            str += teens[remainder - 10] + " ";
        } else {
            let ten = Math.floor(remainder / 10);
            let unit = remainder % 10;
            if (ten > 0) str += tens[ten] + " ";
            if (unit > 0) str += units[unit] + " ";
        }
        return str.trim();
    }

    let word = "";
    let parts = [];

    parts.push(num % 1000);
    num = Math.floor(num / 1000);
    parts.push(num % 100);
    num = Math.floor(num / 100);
    parts.push(num % 100);
    num = Math.floor(num / 100);
    if (num > 0) parts.push(num);

    for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i] > 0) {
            word += convertHundred(parts[i]) + " " + (thousands[i] ? thousands[i] + " " : "");
        }
    }

    return word.trim();
}
