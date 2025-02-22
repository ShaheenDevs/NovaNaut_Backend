-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 22, 2025 at 12:22 PM
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
(1, 600000, 600, 4400, 1, '2025-02-22 10:46:12', '2025-02-22 11:15:45');

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
(1, 'Beautiful Sunset', 'Beautiful Sunset', 'Nature', 'https://picsum.photos/200', '2025-02-18 01:53:05', '2025-02-18 01:53:05', 0),
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
('20250222093454-create-mined.js');

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
  `kyc` tinyint(1) DEFAULT NULL,
  `blocked` tinyint(1) DEFAULT NULL,
  `subscribedPlan` varchar(255) DEFAULT NULL,
  `balance` int(11) DEFAULT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `miningLevel` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `profile` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `fullName`, `email`, `phoneNo`, `country`, `password`, `kyc`, `blocked`, `subscribedPlan`, `balance`, `emailVerified`, `miningLevel`, `createdAt`, `updatedAt`, `profile`) VALUES
(0, 'M Ali', 'xyz@gmail.com', '1234567890', 'PK', '$2a$12$E8XTcO5IK1yN0LiAibPrruTSi3LSXcJR00onrQqmXYJXTa4R/8DEe', 0, 0, 'free', 100, 0, 1, '2025-02-16 09:30:49', '2025-02-16 09:30:49', 'https://picsum.photos/200'),
(1, 'Mudassir', 'abc@gmail.com', '1234567890', 'PK', '$2a$12$q1JORr1vI.6IipeDKmX7Xuk7zCwQ2gX2uuRVP0z4jWWiykKVVIMU.', 0, 0, 'free', 500, 1, 1, '2025-02-15 11:26:48', '2025-02-15 11:53:29', 'https://picsum.photos/200');

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
-- Indexes for table `Mineds`
--
ALTER TABLE `Mineds`
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
-- AUTO_INCREMENT for table `Mineds`
--
ALTER TABLE `Mineds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Notifications`
--
ALTER TABLE `Notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3003;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
