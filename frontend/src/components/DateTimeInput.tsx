import type { ChangeEvent } from "react";

const BASE_MINUTES = ["05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

interface DateTimeParts {
    date: string;
    hour: string;
    minute: string;
}

interface DateTimeInputProps {
    idPrefix: string;
    label: string;
    value: string;
    onChange: (nextValue: string) => void;
}

const splitDateTime = (value: string): DateTimeParts => {
    if (!value) {
        return { date: "", hour: "09", minute: "05" };
    }

    const [date, time] = value.split("T");
    const [hour = "09", minute = "05"] = (time || "").split(":");

    return {
        date: date || "",
        hour,
        minute,
    };
};

const joinDateTime = ({ date, hour, minute }: DateTimeParts): string => {
    if (!date) return "";
    return `${date}T${hour}:${minute}`;
};

export const DateTimeInput = ({ idPrefix, label, value, onChange }: DateTimeInputProps) => {
    const parts = splitDateTime(value);

    const minuteOptions = BASE_MINUTES.includes(parts.minute)
        ? BASE_MINUTES
        : [parts.minute, ...BASE_MINUTES].sort((a, b) => Number(a) - Number(b));

    const update = (patch: Partial<DateTimeParts>) => {
        const nextParts = { ...parts, ...patch };
        onChange(joinDateTime(nextParts));
    };

    const onDateChange = (e: ChangeEvent<HTMLInputElement>) => update({ date: e.target.value });
    const onHourChange = (e: ChangeEvent<HTMLSelectElement>) => update({ hour: e.target.value });
    const onMinuteChange = (e: ChangeEvent<HTMLSelectElement>) => update({ minute: e.target.value });

    return (
        <div className="datetime-card">
            <label htmlFor={`${idPrefix}-date`}>{label}</label>
            <div className="datetime-fields">
                <input
                    id={`${idPrefix}-date`}
                    type="date"
                    value={parts.date}
                    onChange={onDateChange}
                    required
                />
                <div className="time-inline">
                    <select id={`${idPrefix}-hour`} value={parts.hour} onChange={onHourChange} required>
                        {HOURS.map((hour) => (
                            <option key={hour} value={hour}>
                                {hour}
                            </option>
                        ))}
                    </select>
                    <span className="time-separator">:</span>
                    <select id={`${idPrefix}-minute`} value={parts.minute} onChange={onMinuteChange} required>
                        {minuteOptions.map((minute) => (
                            <option key={minute} value={minute}>
                                {minute}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
