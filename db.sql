-- Users Table
CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, profile_img VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, email_verified BOOLEAN NOT NULL DEFAULT FALSE
);

-- Friendships Table
CREATE TABLE Friendship (
    user_id INT NOT NULL, friend_id INT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, friend_id), FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE, FOREIGN KEY (friend_id) REFERENCES User (id) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(255) NOT NULL,
    extra VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seen BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (target) REFERENCES User(user_id) ON DELETE CASCADE


);