export default function formatTime(millis: number): string {
    // Вычисляем секунды, минуты и часы
    var seconds: number = Math.floor((millis / 1000) % 60);
    var minutes: number = Math.floor((millis / (1000 * 60)) % 60);
    var hours: number = Math.floor((millis / (1000 * 60 * 60)) % 24);

    // Добавляем нули перед значениями, если они однозначные
    hours = hours < 10 ? 0 + hours : hours;
    minutes = minutes < 10 ? 0 + minutes : minutes;
    seconds = seconds < 10 ? 0 + seconds : seconds;

    // if ((hours >= 0) || (minutes >= 0) || (seconds >= 0)) {
        return hours + ":" + minutes + ":" + seconds;
    // } else {
    //     return '0';
    // }
}