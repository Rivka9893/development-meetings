import { useEffect, useMemo, useRef, useState } from "react";
import type { Team } from "../types";

interface TeamPickerProps {
    teams: Team[];
    selectedTeamId: number | "";
    onSelect: (teamId: number | "") => void;
    labelId: string;
    placeholder?: string;
}

export const TeamPicker = ({
    teams,
    selectedTeamId,
    onSelect,
    labelId,
    placeholder = "Choose team...",
}: TeamPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement | null>(null);

    const selectedTeamName = useMemo(
        () => teams.find((team) => team.team_id === selectedTeamId)?.team_name || placeholder,
        [teams, selectedTeamId, placeholder]
    );

    useEffect(() => {
        const onPointerDown = (event: MouseEvent) => {
            if (!pickerRef.current) return;
            if (!pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, []);

    return (
        <div className="team-picker" ref={pickerRef}>
            <button
                type="button"
                className="team-picker-trigger"
                aria-labelledby={labelId}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>{selectedTeamName}</span>
                <span className={`team-picker-arrow ${isOpen ? "open" : ""}`}>▾</span>
            </button>

            {isOpen && (
                <div className="team-picker-menu" role="listbox" aria-label="Team options">
                    <button
                        type="button"
                        className={`team-picker-item ${selectedTeamId === "" ? "selected" : ""}`}
                        onClick={() => {
                            onSelect("");
                            setIsOpen(false);
                        }}
                    >
                        {placeholder}
                    </button>

                    {teams.length === 0 ? (
                        <div className="team-picker-empty">No teams loaded yet</div>
                    ) : (
                        teams.map((team) => (
                            <button
                                key={team.team_id}
                                type="button"
                                className={`team-picker-item ${selectedTeamId === team.team_id ? "selected" : ""}`}
                                onClick={() => {
                                    onSelect(team.team_id);
                                    setIsOpen(false);
                                }}
                            >
                                {team.team_name}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
