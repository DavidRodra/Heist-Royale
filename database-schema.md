# Casino Max Database Schema

This document outlines the database schema for the Casino Max platform. Currently implemented using localStorage for demo purposes, but designed to be easily migrated to a real database.

## Tables

### Users Table
Stores user account information and authentication data.

```sql
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    country VARCHAR(2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    date_of_birth DATE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE
);
```

### Games Table
Stores information about available games.

```sql
CREATE TABLE games (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    rtp DECIMAL(5,2) NOT NULL,
    min_bet DECIMAL(10,2) NOT NULL,
    max_bet DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    thumbnail_url VARCHAR(500),
    game_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Transactions Table
Stores all financial transactions (deposits, withdrawals, game bets, wins).

```sql
CREATE TABLE transactions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type ENUM('deposit', 'withdrawal', 'bet', 'win', 'bonus', 'refund') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    game_id VARCHAR(50) NULL,
    description TEXT,
    reference_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);
```

### Game Sessions Table
Tracks individual game sessions and results.

```sql
CREATE TABLE game_sessions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    bet_amount DECIMAL(10,2) NOT NULL,
    win_amount DECIMAL(10,2) DEFAULT 0.00,
    session_data JSON,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    duration_seconds INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);
```

### User Achievements Table
Tracks user achievements and rewards.

```sql
CREATE TABLE user_achievements (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    reward_amount DECIMAL(10,2) DEFAULT 0.00,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Security Logs Table
Stores security-related events for monitoring and auditing.

```sql
CREATE TABLE security_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NULL,
    event_type VARCHAR(50) NOT NULL,
    event_description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Promotions Table
Stores promotional offers and bonuses.

```sql
CREATE TABLE promotions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type ENUM('welcome_bonus', 'deposit_bonus', 'free_spins', 'cashback', 'tournament') NOT NULL,
    bonus_amount DECIMAL(10,2) DEFAULT 0.00,
    bonus_percentage DECIMAL(5,2) DEFAULT 0.00,
    min_deposit DECIMAL(10,2) DEFAULT 0.00,
    max_bonus DECIMAL(10,2) NULL,
    wagering_requirement DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Promotions Table
Tracks which users have claimed which promotions.

```sql
CREATE TABLE user_promotions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    promotion_id VARCHAR(50) NOT NULL,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bonus_amount DECIMAL(10,2) NOT NULL,
    wagering_completed DECIMAL(10,2) DEFAULT 0.00,
    is_claimed BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);
```

## Indexes

### Performance Indexes
```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Transactions table indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Game sessions table indexes
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX idx_game_sessions_started_at ON game_sessions(started_at);

-- Security logs table indexes
CREATE INDEX idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX idx_security_logs_created_at ON security_logs(created_at);
```

## Data Relationships

1. **Users** → **Transactions** (One-to-Many)
   - A user can have multiple transactions
   - Each transaction belongs to one user

2. **Users** → **Game Sessions** (One-to-Many)
   - A user can have multiple game sessions
   - Each game session belongs to one user

3. **Games** → **Game Sessions** (One-to-Many)
   - A game can have multiple sessions
   - Each game session belongs to one game

4. **Users** → **User Achievements** (One-to-Many)
   - A user can have multiple achievements
   - Each achievement belongs to one user

5. **Users** → **User Promotions** (One-to-Many)
   - A user can claim multiple promotions
   - Each user promotion belongs to one user

6. **Promotions** → **User Promotions** (One-to-Many)
   - A promotion can be claimed by multiple users
   - Each user promotion belongs to one promotion

## Sample Data

### Games
```sql
INSERT INTO games (id, name, description, category, provider, rtp, min_bet, max_bet, is_active) VALUES
('book-of-ra', 'Book of Ra', 'Ancient Egyptian slot adventure', 'slots', 'CasinoMax', 96.50, 0.10, 100.00, TRUE),
('blackjack', 'Blackjack', 'Classic card game', 'table', 'CasinoMax', 99.50, 1.00, 500.00, TRUE),
('ocean-hunter', 'Ocean Hunter', 'Fish shooting game', 'arcade', 'CasinoMax', 97.20, 0.50, 200.00, TRUE);
```

### Promotions
```sql
INSERT INTO promotions (id, name, description, type, bonus_percentage, min_deposit, max_bonus, wagering_requirement, valid_from, valid_until) VALUES
('welcome-bonus', 'Welcome Bonus', '200% bonus up to $2000', 'welcome_bonus', 200.00, 10.00, 2000.00, 35.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR)),
('deposit-bonus', 'Weekly Deposit Bonus', '50% bonus up to $500', 'deposit_bonus', 50.00, 20.00, 500.00, 25.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR));
```

## Migration Notes

When migrating from localStorage to a real database:

1. **Data Export**: Create a script to export all localStorage data
2. **Data Validation**: Validate data integrity before migration
3. **Password Migration**: Ensure password hashes are compatible
4. **Session Management**: Implement proper session management
5. **Backup Strategy**: Implement regular database backups
6. **Monitoring**: Set up database monitoring and alerting

## Security Considerations

1. **Password Hashing**: Use bcrypt or Argon2 for password hashing
2. **Encryption**: Encrypt sensitive data at rest
3. **Access Control**: Implement proper database access controls
4. **Audit Logging**: Log all database access and modifications
5. **Backup Encryption**: Encrypt database backups
6. **Connection Security**: Use SSL/TLS for database connections






