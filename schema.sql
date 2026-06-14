CREATE DATABASE IF NOT EXISTS DevelopmentMeetingsDB;
USE DevelopmentMeetingsDB;

CREATE TABLE IF NOT EXISTS development_teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS meetings (
    meeting_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES development_teams(team_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
