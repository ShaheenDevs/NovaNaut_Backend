-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 27, 2025 at 06:23 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `novanaut`
--

-- --------------------------------------------------------

--
-- Table structure for table `Docs`
--

CREATE TABLE `Docs` (
  `id` int(11) NOT NULL,
  `privacyPolicy` varchar(255) DEFAULT NULL,
  `termsConditions` varchar(255) DEFAULT NULL,
  `whitePaper` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Docs`
--

INSERT INTO `Docs` (`id`, `privacyPolicy`, `termsConditions`, `whitePaper`, `createdAt`, `updatedAt`) VALUES
(1, '/documents/privacyPolicy.pdf', '/documents/termsConditions.pdf', '/documents/whitePaper.pdf', '2025-02-16 11:08:35', '2025-02-16 17:02:17');

-- --------------------------------------------------------

--
-- Table structure for table `Invitations`
--

CREATE TABLE `Invitations` (
  `id` int(11) NOT NULL,
  `reReferralBy` int(11) DEFAULT NULL,
  `newUserId` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Invitations`
--

INSERT INTO `Invitations` (`id`, `reReferralBy`, `newUserId`, `status`, `createdAt`, `updatedAt`) VALUES
(4, 1, 4, 'pending', '2025-02-27 14:35:59', '2025-02-27 14:35:59'),
(5, 1, 5, 'pending', '2025-02-27 14:36:12', '2025-02-27 14:36:12'),
(6, 1, 8, 'accepted', '2025-02-27 14:36:48', '2025-02-27 14:41:32'),
(7, 1, 10, 'pending', '2025-02-27 16:15:45', '2025-02-27 16:15:45'),
(8, 1, 11, 'pending', '2025-02-27 16:54:40', '2025-02-27 16:54:40');

-- --------------------------------------------------------

--
-- Table structure for table `Levels`
--

CREATE TABLE `Levels` (
  `id` int(11) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `rate` float DEFAULT NULL,
  `condition` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Levels`
--

INSERT INTO `Levels` (`id`, `level`, `title`, `rate`, `condition`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Level 1', 0.02, 'KYC', '2025-02-27 16:46:54', '2025-02-27 16:52:10');

-- --------------------------------------------------------

--
-- Table structure for table `Messages`
--

CREATE TABLE `Messages` (
  `id` int(11) NOT NULL,
  `senderId` int(11) DEFAULT NULL,
  `receiverId` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `messageType` varchar(255) DEFAULT NULL,
  `seen` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Messages`
--

INSERT INTO `Messages` (`id`, `senderId`, `receiverId`, `message`, `messageType`, `seen`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, 'Hey kasa ho', NULL, NULL, '2025-02-24 02:58:11', '2025-02-24 02:58:11'),
(2, 1, 2, 'Hey kasa ho', NULL, NULL, '2025-02-26 17:07:44', '2025-02-26 17:07:44');

-- --------------------------------------------------------

--
-- Table structure for table `Mineds`
--

CREATE TABLE `Mineds` (
  `id` int(11) NOT NULL,
  `totalMineableTokens` int(11) DEFAULT NULL,
  `totalMinedTokens` int(11) DEFAULT NULL,
  `remainderTokens` int(11) DEFAULT NULL,
  `isAllow` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Mineds`
--

INSERT INTO `Mineds` (`id`, `totalMineableTokens`, `totalMinedTokens`, `remainderTokens`, `isAllow`, `createdAt`, `updatedAt`) VALUES
(1, 600000, 310, 599690, 1, '2025-02-22 10:46:12', '2025-02-27 13:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `Minings`
--

CREATE TABLE `Minings` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `balance` int(11) DEFAULT NULL,
  `miningRate` float DEFAULT NULL,
  `minedAmount` int(11) DEFAULT NULL,
  `timeElapsed` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Notifications`
--

CREATE TABLE `Notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Notifications`
--

INSERT INTO `Notifications` (`id`, `title`, `description`, `link`, `imageUrl`, `createdAt`, `updatedAt`, `userId`) VALUES
(1, 'Beautiful Sunset', 'Beautiful Sunset', 'Nature', 'https://picsum.photos/200', '2025-02-18 01:53:05', '2025-02-18 01:53:05', 2),
(2, 'Beautiful Sunset', 'Beautiful Sunset', 'Nature', 'https://picsum.photos/200', '2025-02-18 01:54:21', '2025-02-18 01:54:21', 1);

-- --------------------------------------------------------

--
-- Table structure for table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20250215102615-create-user.js'),
('20250216100315-create-doc.js'),
('20250216101512-create-version.js'),
('20250216162150-create-wallpaper.js'),
('20250218014707-create-notification.js'),
('20250222093454-create-mined.js'),
('20250224024131-create-message.js'),
('20250225153628-create-invitation.js'),
('20250226015750-create-mining.js'),
('20250227163744-create-level.js');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNo` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `kyc` tinyint(1) DEFAULT 0,
  `blocked` tinyint(1) DEFAULT 0,
  `subscribedPlan` varchar(255) DEFAULT 'free',
  `balance` int(11) DEFAULT 0,
  `emailVerified` tinyint(1) DEFAULT 0,
  `miningLevel` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `profile` varchar(255) DEFAULT NULL,
  `miningStartTime` datetime DEFAULT NULL,
  `streakStartDate` datetime DEFAULT NULL,
  `streakLastDate` datetime DEFAULT NULL,
  `refId` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'NONA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `fullName`, `email`, `phoneNo`, `country`, `password`, `kyc`, `blocked`, `subscribedPlan`, `balance`, `emailVerified`, `miningLevel`, `createdAt`, `updatedAt`, `profile`, `miningStartTime`, `streakStartDate`, `streakLastDate`, `refId`) VALUES
(1, 'Mudassir', 'abc@gmail.com', '1234567890', 'Pakistan', '$2a$12$q1JORr1vI.6IipeDKmX7Xuk7zCwQ2gX2uuRVP0z4jWWiykKVVIMU.', 1, 0, 'free', 210, 1, 3, '2025-02-15 11:26:48', '2025-02-27 11:37:54', 'https://picsum.photos/200', '2025-02-27 11:20:23', NULL, NULL, 'SHAHEENDEV'),
(2, 'M Ali', 'xyz@gmail.com', '1234567890', 'PK', '$2a$12$E8XTcO5IK1yN0LiAibPrruTSi3LSXcJR00onrQqmXYJXTa4R/8DEe', 0, 0, 'free', 100, 0, 1, '2025-02-16 09:30:49', '2025-02-16 09:30:49', 'https://picsum.photos/200', NULL, NULL, NULL, 'nona'),
(4, 'Fazan', 'xyz1@gmail.com', '1234567890', 'PK', '$2a$12$gfPhvbsX96nWpdgjdR8uqunllNGRURs/APC4CjRUUPBlNVEIiqrV2', 0, 0, 'free', 0, 0, 1, '2025-02-27 14:32:59', '2025-02-27 14:32:59', 'https://picsum.photos/200', NULL, NULL, NULL, 'nona'),
(5, 'Laiba', 'xyz2@gmail.com', '1234567890', 'PK', '$2a$12$9rP4Q/R8hQVYxpepTagiru9hxQr3E0xHfNgJ2KQIfrmOmKYdSmXce', 0, 0, 'free', 0, 0, 1, '2025-02-27 14:34:43', '2025-02-27 14:34:43', 'https://picsum.photos/200', NULL, NULL, NULL, 'nona'),
(6, 'M Ali', 'xyz3@gmail.com', '1234567890', 'PK', '$2a$12$zZlXxgNurveJ21PjdOE2gOPfU/ocxRH14puJis7rM2EaC2Xbur5sG', 0, 0, 'free', 0, 0, 1, '2025-02-27 14:35:36', '2025-02-27 14:35:36', 'https://picsum.photos/200', NULL, NULL, NULL, 'nona'),
(7, 'M Ali', 'xyz4@gmail.com', '1234567890', 'PK', '$2a$12$9UHcn4.XUobuGDUXx6a2.ux2gwjSYYgb0de6Nn6i39znf9U/bW/CG', 0, 0, 'free', 0, 0, 1, '2025-02-27 14:36:10', '2025-02-27 14:36:10', 'https://picsum.photos/200', NULL, NULL, NULL, 'nona'),
(8, 'Misha', 'xyz5@gmail.com', '1234567890', 'PK', '$2a$12$JyB2oMYYQJXYKGJyW6EG2OYiDNeLCg41XqvaVzhmG/ZkJePXz2qri', 0, 0, 'free', 0, 0, 1, '2025-02-27 14:36:45', '2025-02-27 14:36:45', 'https://picsum.photos/200', NULL, NULL, NULL, 'nona'),
(9, 'M Ali', 'xyz6@gmail.com', '1234567890', 'PK', '$2a$12$D7jIZSPBX6HbBMDEEmVeCeIqYOifqDCQqx5p.y79CmOMHLHo41Duq', 0, 0, 'free', 0, 0, 1, '2025-02-27 16:11:13', '2025-02-27 16:11:13', 'https://picsum.photos/200', NULL, NULL, NULL, 'nona'),
(10, 'M Ali', 'xyz7@gmail.com', '1234567890', 'PK', '$2a$12$YBizq29r5pnolwt7J4/CjuABfnypPZSUbHt8EszJr4Xe9RLk2nGaS', 0, 0, 'free', 0, 0, 1, '2025-02-27 16:15:45', '2025-02-27 16:15:45', 'https://picsum.photos/200', NULL, NULL, NULL, 'nona'),
(11, 'M Ali', 'xyz8@gmail.com', '1234567890', 'PK', '$2a$12$QfbVABtCwZCur9bZZBV7DuehYy7rLCnoY06xb64GDzG2SCcJKI9Hm', 0, 0, 'free', 0, 0, 1, '2025-02-27 16:54:40', '2025-02-27 16:54:40', 'https://picsum.photos/200', NULL, NULL, NULL, 'NONA');

-- --------------------------------------------------------

--
-- Table structure for table `Versions`
--

CREATE TABLE `Versions` (
  `id` int(11) NOT NULL,
  `version` varchar(11) DEFAULT NULL,
  `forceUpdateVersion` varchar(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Versions`
--

INSERT INTO `Versions` (`id`, `version`, `forceUpdateVersion`, `createdAt`, `updatedAt`) VALUES
(1, '1.0.0', '1.0.0', '2025-02-16 11:25:02', '2025-02-16 12:15:36');

-- --------------------------------------------------------

--
-- Table structure for table `Wallpapers`
--

CREATE TABLE `Wallpapers` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Wallpapers`
--

INSERT INTO `Wallpapers` (`id`, `title`, `imageUrl`, `category`, `createdAt`, `updatedAt`) VALUES
(2, 'Beautiful Sunset', 'https://picsum.photos/200', 'Nature', '2025-02-16 16:30:05', '2025-02-16 16:30:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Docs`
--
ALTER TABLE `Docs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Invitations`
--
ALTER TABLE `Invitations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Levels`
--
ALTER TABLE `Levels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Messages`
--
ALTER TABLE `Messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Mineds`
--
ALTER TABLE `Mineds`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Minings`
--
ALTER TABLE `Minings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Notifications`
--
ALTER TABLE `Notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notifications_user` (`userId`);

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Versions`
--
ALTER TABLE `Versions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Wallpapers`
--
ALTER TABLE `Wallpapers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Docs`
--
ALTER TABLE `Docs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Invitations`
--
ALTER TABLE `Invitations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Levels`
--
ALTER TABLE `Levels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Messages`
--
ALTER TABLE `Messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Mineds`
--
ALTER TABLE `Mineds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Minings`
--
ALTER TABLE `Minings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Notifications`
--
ALTER TABLE `Notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3003;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Versions`
--
ALTER TABLE `Versions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Wallpapers`
--
ALTER TABLE `Wallpapers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Notifications`
--
ALTER TABLE `Notifications`
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
