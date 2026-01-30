declare module 'lunisolar' {
  interface LunisolarInstance {
    format(format: string): string;
    zodiac: string;
    solarTerm: string | null;
    year: number;
    month: number;
    day: number;
    lunar: {
      year: number;
      month: number;
      day: number;
      isLeap: boolean;
    };
  }

  function lunisolar(date: Date): LunisolarInstance;

  export = lunisolar;
  export default lunisolar;
}
