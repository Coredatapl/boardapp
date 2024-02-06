export enum DayTimeLabel {
  morning = 'morning',
  afternoon = 'afternoon',
  evening = 'evening',
}

export class DateTime {
  private static morningLimit = 12;
  private static afternoonLimit = 18;

  static getDayTime(): string {
    const hour = new Date().getHours();
    let label = '';

    if (hour < this.morningLimit) {
      label = DayTimeLabel.morning;
    } else if (hour >= this.morningLimit && hour < this.afternoonLimit) {
      label = DayTimeLabel.afternoon;
    } else if (hour >= this.afternoonLimit) {
      label = DayTimeLabel.evening;
    }
    return label;
  }

  static getTimeAgo(date: number | string): string {
    if (typeof date === 'string') {
      date = Date.parse(date);
    }

    const seconds = Math.floor((Date.now() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + ' years ago';
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' months ago';
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' days ago';
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' hours ago';
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' minutes ago';
    }

    if (seconds < 10) return 'just now';

    return Math.floor(seconds) + ' seconds ago';
  }
}
