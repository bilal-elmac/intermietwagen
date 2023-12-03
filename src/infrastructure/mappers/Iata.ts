const PATTERN = /^[A-Z]{3}$/;

export const mapIata = (iata: unknown): string | null => {
    const match = PATTERN.exec(String(iata || ''));
    return (match && match[0]) || null;
};
