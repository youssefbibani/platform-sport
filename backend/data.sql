-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 03, 2026 at 02:02 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `data`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE IF NOT EXISTS `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE IF NOT EXISTS `auth_group_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_id` (`group_id`,`permission_id`),
  KEY `permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE IF NOT EXISTS `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `content_type_id` (`content_type_id`,`codename`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `content_type_id`, `codename`, `name`) VALUES
(1, 1, 'add_logentry', 'Can add log entry'),
(2, 1, 'change_logentry', 'Can change log entry'),
(3, 1, 'delete_logentry', 'Can delete log entry'),
(4, 1, 'view_logentry', 'Can view log entry'),
(5, 3, 'add_permission', 'Can add permission'),
(6, 3, 'change_permission', 'Can change permission'),
(7, 3, 'delete_permission', 'Can delete permission'),
(8, 3, 'view_permission', 'Can view permission'),
(9, 2, 'add_group', 'Can add group'),
(10, 2, 'change_group', 'Can change group'),
(11, 2, 'delete_group', 'Can delete group'),
(12, 2, 'view_group', 'Can view group'),
(13, 4, 'add_user', 'Can add user'),
(14, 4, 'change_user', 'Can change user'),
(15, 4, 'delete_user', 'Can delete user'),
(16, 4, 'view_user', 'Can view user'),
(17, 5, 'add_contenttype', 'Can add content type'),
(18, 5, 'change_contenttype', 'Can change content type'),
(19, 5, 'delete_contenttype', 'Can delete content type'),
(20, 5, 'view_contenttype', 'Can view content type'),
(21, 6, 'add_session', 'Can add session'),
(22, 6, 'change_session', 'Can change session'),
(23, 6, 'delete_session', 'Can delete session'),
(24, 6, 'view_session', 'Can view session'),
(25, 7, 'add_profile', 'Can add profile'),
(26, 7, 'change_profile', 'Can change profile'),
(27, 7, 'delete_profile', 'Can delete profile'),
(28, 7, 'view_profile', 'Can view profile'),
(29, 8, 'add_contactmessage', 'Can add contact message'),
(30, 8, 'change_contactmessage', 'Can change contact message'),
(31, 8, 'delete_contactmessage', 'Can delete contact message'),
(32, 8, 'view_contactmessage', 'Can view contact message'),
(33, 10, 'add_eventcategory', 'Can add event category'),
(34, 10, 'change_eventcategory', 'Can change event category'),
(35, 10, 'delete_eventcategory', 'Can delete event category'),
(36, 10, 'view_eventcategory', 'Can view event category'),
(37, 14, 'add_location', 'Can add location'),
(38, 14, 'change_location', 'Can change location'),
(39, 14, 'delete_location', 'Can delete location'),
(40, 14, 'view_location', 'Can view location'),
(41, 18, 'add_sport', 'Can add sport'),
(42, 18, 'change_sport', 'Can change sport'),
(43, 18, 'delete_sport', 'Can delete sport'),
(44, 18, 'view_sport', 'Can view sport'),
(45, 9, 'add_event', 'Can add event'),
(46, 9, 'change_event', 'Can change event'),
(47, 9, 'delete_event', 'Can delete event'),
(48, 9, 'view_event', 'Can view event'),
(49, 11, 'add_eventmedia', 'Can add event media'),
(50, 11, 'change_eventmedia', 'Can change event media'),
(51, 11, 'delete_eventmedia', 'Can delete event media'),
(52, 11, 'view_eventmedia', 'Can view event media'),
(53, 15, 'add_order', 'Can add order'),
(54, 15, 'change_order', 'Can change order'),
(55, 15, 'delete_order', 'Can delete order'),
(56, 15, 'view_order', 'Can view order'),
(57, 16, 'add_orderitem', 'Can add order item'),
(58, 16, 'change_orderitem', 'Can change order item'),
(59, 16, 'delete_orderitem', 'Can delete order item'),
(60, 16, 'view_orderitem', 'Can view order item'),
(61, 17, 'add_review', 'Can add review'),
(62, 17, 'change_review', 'Can change review'),
(63, 17, 'delete_review', 'Can delete review'),
(64, 17, 'view_review', 'Can view review'),
(65, 19, 'add_ticket', 'Can add ticket'),
(66, 19, 'change_ticket', 'Can change ticket'),
(67, 19, 'delete_ticket', 'Can delete ticket'),
(68, 19, 'view_ticket', 'Can view ticket'),
(69, 12, 'add_eventparticipant', 'Can add event participant'),
(70, 12, 'change_eventparticipant', 'Can change event participant'),
(71, 12, 'delete_eventparticipant', 'Can delete event participant'),
(72, 12, 'view_eventparticipant', 'Can view event participant'),
(73, 20, 'add_tickettype', 'Can add ticket type'),
(74, 20, 'change_tickettype', 'Can change ticket type'),
(75, 20, 'delete_tickettype', 'Can delete ticket type'),
(76, 20, 'view_tickettype', 'Can view ticket type'),
(77, 13, 'add_favorite', 'Can add favorite'),
(78, 13, 'change_favorite', 'Can change favorite'),
(79, 13, 'delete_favorite', 'Can delete favorite'),
(80, 13, 'view_favorite', 'Can view favorite');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE IF NOT EXISTS `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime NOT NULL,
  `first_name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`, `first_name`) VALUES
(1, 'pbkdf2_sha256$1200000$oMMC9X0pmFWeu6zInhSyuf$s2bDe1IsZZfzZ9510cD5xVvBAViUNunJCJNcqqiFaNo=', NULL, 1, 'biba', '', 'biba@gmail.com', 1, 1, '2026-01-10 18:43:24', ''),
(2, 'pbkdf2_sha256$1200000$nglmPbhoQ1AVPlXYc5TcbB$HgCl7Ul171zd1mVld6NzDiiuWJUtRGcUArBQ2XkoMq4=', NULL, 0, 'bibaa@gmail.com', '', 'bibaa@gmail.com', 0, 1, '2026-01-12 13:06:31', ''),
(6, 'pbkdf2_sha256$1200000$JQ8wYSdrR87NoTXdjzu0p7$TxagCqciol6oXu1Y/VdvKs5QHjyW2BCt2aNMBns+K5g=', NULL, 0, 'louey@gmail.com', 'sayar', 'louey@gmail.com', 0, 1, '2026-01-13 07:44:35', 'louey'),
(7, 'pbkdf2_sha256$1200000$CNypUvf9KJ3Fotio8x5TZ8$PNZNE9a6XmE9fMGnAF7jKPxrMBA076/fIdqsAykW8DM=', NULL, 0, 'ysf@gmail.com', 'bibani', 'ysf@gmail.com', 0, 1, '2026-01-13 10:59:51', 'youssef'),
(8, 'pbkdf2_sha256$1200000$kjy1kR15ug55YBQY92go3x$yi0jNdV2wyTRuxB/TyJjShJecvKP0eHyyHM9nRu9t8E=', NULL, 1, 'admin@sportscomp.tn', '', 'admin@sportscomp.tn', 1, 1, '2026-01-19 16:48:58', ''),
(9, 'pbkdf2_sha256$1200000$cbT0pJBBNxTSHRhkl8w9Uv$WDP/3JjwjQVOVOBF7ZFoIpcTYQWCgWAaXCw4+CMRZp0=', '2026-01-23 13:42:23', 1, 'biba@gmailcom', '', 'biba@gmailcom', 1, 1, '2026-01-19 17:03:22', ''),
(10, 'pbkdf2_sha256$1200000$5US75PZxwN6rCD0FIiDn7J$iTFu4+vXpMBVbkHuyX4wNBaoMNdSLh2q2vz6mMFWhJI=', NULL, 0, 'rayen@gmail.com', 'lounis', 'rayen@gmail.com', 0, 1, '2026-01-30 01:01:22', 'rayen'),
(11, 'pbkdf2_sha256$1200000$G88j2Fi5drKrkzbG56CCa8$BY6eFMM+lhIFCwJNzFbkNStzDHD5ZeaeHUb6kNF23+I=', NULL, 0, 'adam@gmail.com', 'medden', 'adam@gmail.com', 0, 1, '2026-01-30 14:57:44', 'adam');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE IF NOT EXISTS `auth_user_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`group_id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `name` varchar(80) NOT NULL,
  `slug` varchar(80) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `sport_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_id` (`sport_id`,`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `created_at`, `updated_at`, `name`, `slug`, `is_active`, `sport_id`) VALUES
(1, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Tournoi', 'tournoi', 1, 1),
(2, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Stage', 'stage', 1, 1),
(3, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Match amical', 'match-amical', 1, 1),
(4, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Ligue', 'ligue', 1, 1),
(5, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Camp d\'entrainement', 'camp-dentrainement', 1, 1),
(6, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Course', 'course', 1, 1),
(7, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Tournoi', 'tournoi-2', 1, 2),
(8, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Stage', 'stage-2', 1, 2),
(9, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Match amical', 'match-amical-2', 1, 2),
(10, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Ligue', 'ligue-2', 1, 2),
(11, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Camp d\'entrainement', 'camp-dentrainement-2', 1, 2),
(12, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Course', 'course-2', 1, 2),
(13, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Tournoi', 'tournoi-3', 1, 3),
(14, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Stage', 'stage-3', 1, 3),
(15, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Match amical', 'match-amical-3', 1, 3),
(16, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Ligue', 'ligue-3', 1, 3),
(17, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Camp d\'entrainement', 'camp-dentrainement-3', 1, 3),
(18, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Course', 'course-3', 1, 3),
(19, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Tournoi', 'tournoi-4', 1, 4),
(20, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Stage', 'stage-4', 1, 4),
(21, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Match amical', 'match-amical-4', 1, 4),
(22, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Ligue', 'ligue-4', 1, 4),
(23, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Camp d\'entrainement', 'camp-dentrainement-4', 1, 4),
(24, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Course', 'course-4', 1, 4),
(25, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Tournoi', 'tournoi-5', 1, 5),
(26, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Stage', 'stage-5', 1, 5),
(27, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Match amical', 'match-amical-5', 1, 5),
(28, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Ligue', 'ligue-5', 1, 5),
(29, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Camp d\'entrainement', 'camp-dentrainement-5', 1, 5),
(30, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Course', 'course-5', 1, 5),
(31, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Tournoi', 'tournoi-6', 1, 6),
(32, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Stage', 'stage-6', 1, 6),
(33, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Match amical', 'match-amical-6', 1, 6),
(34, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Ligue', 'ligue-6', 1, 6),
(35, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Camp d\'entrainement', 'camp-dentrainement-6', 1, 6),
(36, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Course', 'course-6', 1, 6),
(37, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Tournoi', 'tournoi-7', 1, 7),
(38, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Stage', 'stage-7', 1, 7),
(39, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Match amical', 'match-amical-7', 1, 7),
(40, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Ligue', 'ligue-7', 1, 7),
(41, '2026-01-15 17:20:26', '2026-01-15 17:20:26', 'Camp d\'entrainement', 'camp-dentrainement-7', 1, 7),
(42, '2026-01-15 17:20:26', '2026-01-15 17:20:26', 'Course', 'course-7', 1, 7),
(43, '2026-01-15 17:20:26', '2026-01-15 17:20:26', 'Tournoi', 'tournoi-8', 1, 8),
(44, '2026-01-15 17:20:26', '2026-01-15 17:20:26', 'Stage', 'stage-8', 1, 8),
(45, '2026-01-15 17:20:26', '2026-01-15 17:20:26', 'Match amical', 'match-amical-8', 1, 8),
(46, '2026-01-15 17:20:26', '2026-01-15 17:20:26', 'Ligue', 'ligue-8', 1, 8),
(47, '2026-01-15 17:20:26', '2026-01-15 17:20:26', 'Camp d\'entrainement', 'camp-dentrainement-8', 1, 8),
(48, '2026-01-15 17:20:26', '2026-01-15 17:20:26', 'Course', 'course-8', 1, 8);

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
CREATE TABLE IF NOT EXISTS `contact` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(254) NOT NULL,
  `role` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `name`, `email`, `role`, `message`, `created_at`) VALUES
(1, 'biba', 'biba@gmail.com', 'athlete', 'wnk', '2026-01-12 13:07:08'),
(2, 'biba', 'biba@gmail.com', 'athlete', 'sdqsd', '2026-01-12 14:57:38');

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE IF NOT EXISTS `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `object_id` text,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` int NOT NULL,
  `change_message` text NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `action_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `content_type_id` (`content_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `django_admin_log`
--

INSERT INTO `django_admin_log` (`id`, `object_id`, `object_repr`, `action_flag`, `change_message`, `content_type_id`, `user_id`, `action_time`) VALUES
(1, '5', 'binome@gmail.com', 3, '', 4, 9, '2026-01-26 14:46:52'),
(2, '4', 'rayen@gmail.com', 3, '', 4, 9, '2026-01-26 14:46:52'),
(3, '3', 'walid@gmail.com', 3, '', 4, 9, '2026-01-26 14:46:52');

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE IF NOT EXISTS `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_label` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(7, 'accounts', 'profile'),
(1, 'admin', 'logentry'),
(2, 'auth', 'group'),
(3, 'auth', 'permission'),
(4, 'auth', 'user'),
(8, 'contact', 'contactmessage'),
(5, 'contenttypes', 'contenttype'),
(9, 'events', 'event'),
(10, 'events', 'eventcategory'),
(11, 'events', 'eventmedia'),
(12, 'events', 'eventparticipant'),
(13, 'events', 'favorite'),
(14, 'events', 'location'),
(15, 'events', 'order'),
(16, 'events', 'orderitem'),
(17, 'events', 'review'),
(18, 'events', 'sport'),
(19, 'events', 'ticket'),
(20, 'events', 'tickettype'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE IF NOT EXISTS `django_migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2026-01-10 18:41:38'),
(2, 'auth', '0001_initial', '2026-01-10 18:41:38'),
(3, 'accounts', '0001_initial', '2026-01-10 18:41:38'),
(4, 'admin', '0001_initial', '2026-01-10 18:41:38'),
(5, 'admin', '0002_logentry_remove_auto_add', '2026-01-10 18:41:38'),
(6, 'admin', '0003_logentry_add_action_flag_choices', '2026-01-10 18:41:38'),
(7, 'contenttypes', '0002_remove_content_type_name', '2026-01-10 18:41:38'),
(8, 'auth', '0002_alter_permission_name_max_length', '2026-01-10 18:41:38'),
(9, 'auth', '0003_alter_user_email_max_length', '2026-01-10 18:41:38'),
(10, 'auth', '0004_alter_user_username_opts', '2026-01-10 18:41:38'),
(11, 'auth', '0005_alter_user_last_login_null', '2026-01-10 18:41:38'),
(12, 'auth', '0006_require_contenttypes_0002', '2026-01-10 18:41:38'),
(13, 'auth', '0007_alter_validators_add_error_messages', '2026-01-10 18:41:38'),
(14, 'auth', '0008_alter_user_username_max_length', '2026-01-10 18:41:38'),
(15, 'auth', '0009_alter_user_last_name_max_length', '2026-01-10 18:41:38'),
(16, 'auth', '0010_alter_group_name_max_length', '2026-01-10 18:41:38'),
(17, 'auth', '0011_update_proxy_permissions', '2026-01-10 18:41:38'),
(18, 'auth', '0012_alter_user_first_name_max_length', '2026-01-10 18:41:38'),
(19, 'contact', '0001_initial', '2026-01-10 18:41:38'),
(20, 'sessions', '0001_initial', '2026-01-10 18:41:38'),
(21, 'accounts', '0002_profile_details', '2026-01-13 17:45:15'),
(22, 'events', '0001_initial', '2026-01-15 09:35:34'),
(23, 'events', '0002_event_cancellation_policy_event_cancellation_public', '2026-01-15 16:15:55'),
(24, 'events', '0003_event_status_pending_rejected', '2026-01-22 16:10:50'),
(25, 'events', '0004_remove_unused_models', '2026-01-27 21:59:38'),
(26, 'events', '0005_eventparticipant', '2026-01-30 01:08:26');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
CREATE TABLE IF NOT EXISTS `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` text NOT NULL,
  `expire_date` datetime NOT NULL,
  PRIMARY KEY (`session_key`),
  UNIQUE KEY `session_key` (`session_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('6fpa8d8yz2z1bej23py2k7kabtrcno73', '.eJxVjDsOwyAQRO9CHSEM5pcyvc-AFnYJTiKQjF1FuXtsyUXSjea9mTcLsK0lbJ2WMCO7Ms8uv12E9KR6AHxAvTeeWl2XOfJD4SftfGpIr9vp_h0U6GVfWy1UHITQoxMuD9JYbz24rClZsi4aAAd70Gi8lNJ4owRFxIwi2lER-3wBu303YQ:1vjHQd:ppNUbBqL9xX9vJi0iMIBpKEW9UQCyXNqjAtQyv00y9E', '2026-02-06 13:42:23');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `title` varchar(160) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `short_description` varchar(220) NOT NULL,
  `description` text NOT NULL,
  `event_type` varchar(30) NOT NULL,
  `level_required` varchar(30) NOT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `timezone` varchar(60) NOT NULL,
  `capacity_total` int NOT NULL,
  `capacity_reserved` int NOT NULL,
  `is_free` tinyint(1) NOT NULL,
  `currency` varchar(3) NOT NULL,
  `cover_image_url` varchar(200) NOT NULL,
  `status` varchar(20) NOT NULL,
  `published_at` datetime DEFAULT NULL,
  `organizer_id` int NOT NULL,
  `category_id` bigint NOT NULL,
  `location_id` bigint NOT NULL,
  `sport_id` bigint NOT NULL,
  `cancellation_policy` text NOT NULL,
  `cancellation_public` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `sport_id` (`sport_id`),
  KEY `location_id` (`location_id`),
  KEY `category_id` (`category_id`),
  KEY `organizer_id` (`organizer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `created_at`, `updated_at`, `title`, `slug`, `short_description`, `description`, `event_type`, `level_required`, `start_at`, `end_at`, `timezone`, `capacity_total`, `capacity_reserved`, `is_free`, `currency`, `cover_image_url`, `status`, `published_at`, `organizer_id`, `category_id`, `location_id`, `sport_id`, `cancellation_policy`, `cancellation_public`) VALUES
(1, '2026-01-15 17:48:07', '2026-01-27 00:27:11', 'sdfsdfdsfdsfds', 'arno', 'sdfdsfsd', 'JGJG', 'tournament', 'all', '2026-01-27 01:19:00', '2026-01-27 02:20:00', 'UTC', 40, 0, 1, 'TND', 'https://www.realworldhq.com/', 'rejected', NULL, 7, 23, 1, 4, 'jvj', 1),
(4, '2026-01-19 10:59:14', '2026-01-19 11:01:49', 'arno', 'arno-4', 'haya bara', 'qsdojqshd', 'tournament', 'all', '2026-01-19 15:04:00', '2026-01-19 18:04:00', 'UTC', 40, 2, 1, 'TND', 'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg', 'published', '2026-01-19 11:01:49', 7, 1, 4, 1, 'alo alo', 1),
(8, '2026-01-29 21:27:16', '2026-01-29 21:27:45', 'run in', 'run-in', 'match foot', 'dbache khw', 'match', 'all', '2026-01-29 21:26:00', '2026-01-29 22:26:00', 'UTC', 20, 0, 1, 'TND', '', 'published', '2026-01-29 21:28:00', 7, 1, 8, 1, '', 1),
(9, '2026-01-29 21:29:17', '2026-01-29 21:29:38', 'lessgerit', 'lessgerit', 'social run', 'jibo il ma', 'course', 'all', '2026-01-29 11:28:00', '2026-01-29 12:29:00', 'UTC', 100, 2, 1, 'TND', '', 'published', '2026-01-29 21:30:00', 7, 30, 9, 5, '', 1),
(10, '2026-01-30 14:55:30', '2026-01-30 14:55:53', 'biba', 'biba', 'foot', 'dsf', 'tournament', 'all', '2026-01-30 15:55:00', '2026-01-30 19:55:00', 'UTC', 1, 1, 1, 'TND', '', 'published', '2026-01-30 14:56:07', 7, 1, 10, 1, '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `events_favorite`
--

DROP TABLE IF EXISTS `events_favorite`;
CREATE TABLE IF NOT EXISTS `events_favorite` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `event_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_id` (`event_id`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events_location`
--

DROP TABLE IF EXISTS `events_location`;
CREATE TABLE IF NOT EXISTS `events_location` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `venue_name` varchar(120) NOT NULL,
  `address_line1` varchar(150) NOT NULL,
  `address_line2` varchar(150) NOT NULL,
  `city` varchar(80) NOT NULL,
  `region` varchar(80) NOT NULL,
  `country` varchar(80) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `latitude` decimal(10,2) DEFAULT NULL,
  `longitude` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events_location`
--

INSERT INTO `events_location` (`id`, `created_at`, `updated_at`, `venue_name`, `address_line1`, `address_line2`, `city`, `region`, `country`, `postal_code`, `latitude`, `longitude`) VALUES
(1, '2026-01-15 17:48:07', '2026-01-27 00:20:21', 'HFHFKJG', 'khgjkhv', 'uyydhijf', 'iyttfhji', 'jlhgjh', 'Tunisie', '8001', NULL, NULL),
(2, '2026-01-15 17:49:17', '2026-01-15 17:49:17', 'energy', 'nabeul', 'oui', 'nabeul', 'nabeul', 'Tunisie', '8011', NULL, NULL),
(3, '2026-01-19 10:37:05', '2026-01-19 10:37:05', 'bachroch', 'bachroch blasa', 'terrain', 'darchaabane', 'nabeul', 'Tunisie', '8011', NULL, NULL),
(4, '2026-01-19 10:59:14', '2026-01-19 10:59:14', 'bachroch', 'bachroch blasa', 'terrain', 'darchaabane', 'nabeul', 'Tunisie', '8011', NULL, NULL),
(5, '2026-01-23 13:39:12', '2026-01-23 13:39:12', 'darad', 'adqdq', 'qsdqsdqs', 'qsdqsd', 'qsdqd', 'Tunisie', '8011', NULL, NULL),
(6, '2026-01-23 13:52:56', '2026-01-23 13:52:56', 'sdfsdfqd', 'dqfsdf', 'sdfdsfds', 'dsfsdf', 'dffdqfqs', 'Tunisie', '8000', NULL, NULL),
(7, '2026-01-26 14:44:15', '2026-01-26 14:44:15', 'sfsf', 'qfqf', 'sdfsd', 'sdfsdfsd', 'ytytr', 'Tunisie', '8001', NULL, NULL),
(8, '2026-01-29 21:27:16', '2026-01-29 21:27:16', 'qsdqs', 'qdqs', 'qqf', 'qsdqs', 'qsdqsf', 'Tunisie', '8000', NULL, NULL),
(9, '2026-01-29 21:29:17', '2026-01-29 21:29:17', 'qssqsf', 'qssdfdsq', 'dqfdqf', 'sfd', 'qsf', 'Tunisie', '8010', NULL, NULL),
(10, '2026-01-30 14:55:30', '2026-01-30 14:55:30', 'nabeul', 'qfq', 'qqf', 'qsfqs', 'qsfqsf', 'Tunisie', '8500', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `events_sport`
--

DROP TABLE IF EXISTS `events_sport`;
CREATE TABLE IF NOT EXISTS `events_sport` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `name` varchar(80) NOT NULL,
  `slug` varchar(80) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events_sport`
--

INSERT INTO `events_sport` (`id`, `created_at`, `updated_at`, `name`, `slug`, `is_active`) VALUES
(1, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Football', 'football', 1),
(2, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Basketball', 'basketball', 1),
(3, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Tennis', 'tennis', 1),
(4, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Esport', 'esport', 1),
(5, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Athletisme', 'athletisme', 1),
(6, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Natation', 'natation', 1),
(7, '2026-01-15 17:20:25', '2026-01-15 17:20:25', 'Cyclisme', 'cyclisme', 1),
(8, '2026-01-15 17:20:26', '2026-01-15 17:20:26', 'Arts martiaux', 'arts-martiaux', 1);

-- --------------------------------------------------------

--
-- Table structure for table `events_tickettype`
--

DROP TABLE IF EXISTS `events_tickettype`;
CREATE TABLE IF NOT EXISTS `events_tickettype` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `name` varchar(80) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity_total` int NOT NULL,
  `quantity_sold` int NOT NULL,
  `sales_start` datetime DEFAULT NULL,
  `sales_end` datetime DEFAULT NULL,
  `is_refundable` tinyint(1) NOT NULL,
  `event_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_id` (`event_id`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events_tickettype`
--

INSERT INTO `events_tickettype` (`id`, `created_at`, `updated_at`, `name`, `price`, `quantity_total`, `quantity_sold`, `sales_start`, `sales_end`, `is_refundable`, `event_id`) VALUES
(1, '2026-01-19 12:51:13', '2026-01-27 00:21:05', 'Tarif standard', 0.00, 40, 0, NULL, NULL, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
CREATE TABLE IF NOT EXISTS `media` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `media_type` varchar(20) NOT NULL,
  `url` varchar(200) NOT NULL,
  `title` varchar(120) NOT NULL,
  `is_cover` tinyint(1) NOT NULL,
  `sort_order` int NOT NULL,
  `event_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `created_at`, `updated_at`, `media_type`, `url`, `title`, `is_cover`, `sort_order`, `event_id`) VALUES
(1, '2026-01-19 12:54:04', '2026-01-27 00:21:11', 'image', 'https://www.realworldhq.com/', '', 0, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `participant`
--

DROP TABLE IF EXISTS `participant`;
CREATE TABLE IF NOT EXISTS `participant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  `event_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_id` (`event_id`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `participant`
--

INSERT INTO `participant` (`id`, `created_at`, `updated_at`, `status`, `event_id`, `user_id`) VALUES
(2, '2026-01-30 01:12:10', '2026-01-30 01:12:10', 'active', 4, 10),
(3, '2026-01-30 02:08:58', '2026-01-30 02:08:58', 'active', 9, 10),
(4, '2026-01-30 14:56:41', '2026-01-30 14:56:41', 'active', 10, 10),
(6, '2026-01-30 15:03:24', '2026-01-30 15:03:24', 'active', 4, 11),
(7, '2026-01-30 15:05:20', '2026-01-30 15:05:20', 'active', 9, 11);

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
CREATE TABLE IF NOT EXISTS `profile` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int NOT NULL,
  `address_line` varchar(150) NOT NULL,
  `bio` text NOT NULL,
  `city` varchar(80) NOT NULL,
  `country` varchar(80) NOT NULL,
  `handle` varchar(60) NOT NULL,
  `organization_description` text NOT NULL,
  `organization_name` varchar(150) NOT NULL,
  `organization_type` varchar(120) NOT NULL,
  `organization_website` varchar(200) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `website` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`id`, `role`, `created_at`, `updated_at`, `user_id`, `address_line`, `bio`, `city`, `country`, `handle`, `organization_description`, `organization_name`, `organization_type`, `organization_website`, `phone`, `postal_code`, `website`) VALUES
(1, 'athlete', '2026-01-10 18:43:25', '2026-01-10 18:43:25', 1, '', '', '', '', '', '', '', '', '', '', '', ''),
(2, 'athlete', '2026-01-12 13:06:31', '2026-01-12 13:06:31', 2, '', '', '', '', '', '', '', '', '', '', '', ''),
(6, 'athlete', '2026-01-13 07:44:36', '2026-01-13 07:44:36', 6, '', '', '', '', '', '', '', '', '', '', '', ''),
(7, 'organizer', '2026-01-13 10:59:52', '2026-01-15 10:16:15', 7, '', '', '', '', 'youssef', '', '', '', '', '', '', ''),
(8, 'athlete', '2026-01-19 16:48:58', '2026-01-19 16:48:58', 8, '', '', '', '', '', '', '', '', '', '', '', ''),
(9, 'athlete', '2026-01-19 17:03:22', '2026-01-19 17:03:22', 9, '', '', '', '', '', '', '', '', '', '', '', ''),
(10, 'athlete', '2026-01-30 01:01:23', '2026-01-30 01:01:23', 10, '', '', '', '', '', '', '', '', '', '', '', ''),
(11, 'athlete', '2026-01-30 14:57:45', '2026-01-30 14:57:45', 11, '', '', '', '', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
CREATE TABLE IF NOT EXISTS `user_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`permission_id`),
  KEY `permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissions_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_ibfk_1` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`sport_id`) REFERENCES `events_sport` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  ADD CONSTRAINT `django_admin_log_ibfk_2` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`sport_id`) REFERENCES `events_sport` (`id`),
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `events_location` (`id`),
  ADD CONSTRAINT `events_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `events_ibfk_4` FOREIGN KEY (`organizer_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `events_favorite`
--
ALTER TABLE `events_favorite`
  ADD CONSTRAINT `events_favorite_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  ADD CONSTRAINT `events_favorite_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Constraints for table `events_tickettype`
--
ALTER TABLE `events_tickettype`
  ADD CONSTRAINT `events_tickettype_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Constraints for table `participant`
--
ALTER TABLE `participant`
  ADD CONSTRAINT `participant_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  ADD CONSTRAINT `participant_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
