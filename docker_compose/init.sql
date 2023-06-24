-- MariaDB dump 10.19  Distrib 10.11.3-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 172.16.1.20    Database: ironbank
-- ------------------------------------------------------
-- Server version	11.0.2-MariaDB-1:11.0.2+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `SAE403_account`
--
CREATE USER 'toto'@'172.16.1.10' IDENTIFIED BY 'toto';
CREATE USER 'toto'@'172.16.1.31' IDENTIFIED BY 'toto';
CREATE USER 'toto'@'172.16.1.32' IDENTIFIED BY 'toto';
CREATE USER 'toto'@'172.16.1.33' IDENTIFIED BY 'toto';

CREATE DATABASE ironbank;
GRANT ALL PRIVILEGES ON ironbank.* TO 'toto'@'172.16.1.10';
GRANT ALL PRIVILEGES ON ironbank.* TO 'toto'@'172.16.1.31';
GRANT ALL PRIVILEGES ON ironbank.* TO 'toto'@'172.16.1.32';
GRANT ALL PRIVILEGES ON ironbank.* TO 'toto'@'172.16.1.33';

FLUSH PRIVILEGES;

USE ironbank;

DROP TABLE IF EXISTS `SAE403_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SAE403_account` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `balance` double NOT NULL,
  `is_current` tinyint(1) NOT NULL,
  `rib` varchar(50) NOT NULL,
  `iban` varchar(50) NOT NULL,
  `date_created` datetime(6) NOT NULL,
  `client_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rib` (`rib`),
  UNIQUE KEY `iban` (`iban`),
  KEY `SAE403_account_client_id_69bb8f6d_fk_SAE403_customuser_id` (`client_id`),
  CONSTRAINT `SAE403_account_client_id_69bb8f6d_fk_SAE403_customuser_id` FOREIGN KEY (`client_id`) REFERENCES `SAE403_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SAE403_account`
--

LOCK TABLES `SAE403_account` WRITE;
/*!40000 ALTER TABLE `SAE403_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `SAE403_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SAE403_customuser`
--

DROP TABLE IF EXISTS `SAE403_customuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SAE403_customuser` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `date_of_birth` datetime(6) DEFAULT NULL,
  `profile_image` varchar(100) DEFAULT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SAE403_customuser`
--

LOCK TABLES `SAE403_customuser` WRITE;
/*!40000 ALTER TABLE `SAE403_customuser` DISABLE KEYS */;
/*!40000 ALTER TABLE `SAE403_customuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SAE403_customuser_groups`
--

DROP TABLE IF EXISTS `SAE403_customuser_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SAE403_customuser_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SAE403_customuser_groups_customuser_id_group_id_bc264107_uniq` (`customuser_id`,`group_id`),
  KEY `SAE403_customuser_groups_group_id_abdf6c33_fk_auth_group_id` (`group_id`),
  CONSTRAINT `SAE403_customuser_gr_customuser_id_83867c0b_fk_SAE403_cu` FOREIGN KEY (`customuser_id`) REFERENCES `SAE403_customuser` (`id`),
  CONSTRAINT `SAE403_customuser_groups_group_id_abdf6c33_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SAE403_customuser_groups`
--

LOCK TABLES `SAE403_customuser_groups` WRITE;
/*!40000 ALTER TABLE `SAE403_customuser_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `SAE403_customuser_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SAE403_customuser_user_permissions`
--

DROP TABLE IF EXISTS `SAE403_customuser_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SAE403_customuser_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SAE403_customuser_user_p_customuser_id_permission_ff377d4a_uniq` (`customuser_id`,`permission_id`),
  KEY `SAE403_customuser_us_permission_id_28f9ec7b_fk_auth_perm` (`permission_id`),
  CONSTRAINT `SAE403_customuser_us_customuser_id_d0097d35_fk_SAE403_cu` FOREIGN KEY (`customuser_id`) REFERENCES `SAE403_customuser` (`id`),
  CONSTRAINT `SAE403_customuser_us_permission_id_28f9ec7b_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SAE403_customuser_user_permissions`
--

LOCK TABLES `SAE403_customuser_user_permissions` WRITE;
/*!40000 ALTER TABLE `SAE403_customuser_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `SAE403_customuser_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SAE403_deposit`
--

DROP TABLE IF EXISTS `SAE403_deposit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SAE403_deposit` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) DEFAULT NULL,
  `is_pending` tinyint(1) NOT NULL,
  `amount` double NOT NULL,
  `transaction_date` datetime(6) NOT NULL,
  `destination_id` bigint(20) NOT NULL,
  `source_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SAE403_deposit_destination_id_7489d6b7_fk_SAE403_account_id` (`destination_id`),
  KEY `SAE403_deposit_source_id_d9403a7f_fk_SAE403_customuser_id` (`source_id`),
  CONSTRAINT `SAE403_deposit_destination_id_7489d6b7_fk_SAE403_account_id` FOREIGN KEY (`destination_id`) REFERENCES `SAE403_account` (`id`),
  CONSTRAINT `SAE403_deposit_source_id_d9403a7f_fk_SAE403_customuser_id` FOREIGN KEY (`source_id`) REFERENCES `SAE403_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SAE403_deposit`
--

LOCK TABLES `SAE403_deposit` WRITE;
/*!40000 ALTER TABLE `SAE403_deposit` DISABLE KEYS */;
/*!40000 ALTER TABLE `SAE403_deposit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SAE403_transfer`
--

DROP TABLE IF EXISTS `SAE403_transfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SAE403_transfer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) DEFAULT NULL,
  `is_pending` tinyint(1) NOT NULL,
  `amount` double NOT NULL,
  `transaction_date` datetime(6) NOT NULL,
  `destination_id` bigint(20) NOT NULL,
  `source_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SAE403_transfer_destination_id_e020487f_fk_SAE403_account_id` (`destination_id`),
  KEY `SAE403_transfer_source_id_0fa56347_fk_SAE403_account_id` (`source_id`),
  CONSTRAINT `SAE403_transfer_destination_id_e020487f_fk_SAE403_account_id` FOREIGN KEY (`destination_id`) REFERENCES `SAE403_account` (`id`),
  CONSTRAINT `SAE403_transfer_source_id_0fa56347_fk_SAE403_account_id` FOREIGN KEY (`source_id`) REFERENCES `SAE403_account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SAE403_transfer`
--

LOCK TABLES `SAE403_transfer` WRITE;
/*!40000 ALTER TABLE `SAE403_transfer` DISABLE KEYS */;
/*!40000 ALTER TABLE `SAE403_transfer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SAE403_withdrawal`
--

DROP TABLE IF EXISTS `SAE403_withdrawal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SAE403_withdrawal` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) DEFAULT NULL,
  `is_pending` tinyint(1) NOT NULL,
  `amount` double NOT NULL,
  `transaction_date` datetime(6) NOT NULL,
  `destination_id` bigint(20) NOT NULL,
  `source_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SAE403_withdrawal_destination_id_5eaa9b07_fk_SAE403_cu` (`destination_id`),
  KEY `SAE403_withdrawal_source_id_45ea74b0_fk_SAE403_account_id` (`source_id`),
  CONSTRAINT `SAE403_withdrawal_destination_id_5eaa9b07_fk_SAE403_cu` FOREIGN KEY (`destination_id`) REFERENCES `SAE403_customuser` (`id`),
  CONSTRAINT `SAE403_withdrawal_source_id_45ea74b0_fk_SAE403_account_id` FOREIGN KEY (`source_id`) REFERENCES `SAE403_account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SAE403_withdrawal`
--

LOCK TABLES `SAE403_withdrawal` WRITE;
/*!40000 ALTER TABLE `SAE403_withdrawal` DISABLE KEYS */;
/*!40000 ALTER TABLE `SAE403_withdrawal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES
(1,'Can add log entry',1,'add_logentry'),
(2,'Can change log entry',1,'change_logentry'),
(3,'Can delete log entry',1,'delete_logentry'),
(4,'Can view log entry',1,'view_logentry'),
(5,'Can add permission',2,'add_permission'),
(6,'Can change permission',2,'change_permission'),
(7,'Can delete permission',2,'delete_permission'),
(8,'Can view permission',2,'view_permission'),
(9,'Can add group',3,'add_group'),
(10,'Can change group',3,'change_group'),
(11,'Can delete group',3,'delete_group'),
(12,'Can view group',3,'view_group'),
(13,'Can add content type',4,'add_contenttype'),
(14,'Can change content type',4,'change_contenttype'),
(15,'Can delete content type',4,'delete_contenttype'),
(16,'Can view content type',4,'view_contenttype'),
(17,'Can add session',5,'add_session'),
(18,'Can change session',5,'change_session'),
(19,'Can delete session',5,'delete_session'),
(20,'Can view session',5,'view_session'),
(21,'Can add user',6,'add_customuser'),
(22,'Can change user',6,'change_customuser'),
(23,'Can delete user',6,'delete_customuser'),
(24,'Can view user',6,'view_customuser'),
(25,'Can add account',7,'add_account'),
(26,'Can change account',7,'change_account'),
(27,'Can delete account',7,'delete_account'),
(28,'Can view account',7,'view_account'),
(29,'Can add withdrawal',8,'add_withdrawal'),
(30,'Can change withdrawal',8,'change_withdrawal'),
(31,'Can delete withdrawal',8,'delete_withdrawal'),
(32,'Can view withdrawal',8,'view_withdrawal'),
(33,'Can add transfer',9,'add_transfer'),
(34,'Can change transfer',9,'change_transfer'),
(35,'Can delete transfer',9,'delete_transfer'),
(36,'Can view transfer',9,'view_transfer'),
(37,'Can add deposit',10,'add_deposit'),
(38,'Can change deposit',10,'change_deposit'),
(39,'Can delete deposit',10,'delete_deposit'),
(40,'Can view deposit',10,'view_deposit');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_SAE403_customuser_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_SAE403_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `SAE403_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES
(1,'admin','logentry'),
(3,'auth','group'),
(2,'auth','permission'),
(4,'contenttypes','contenttype'),
(7,'SAE403','account'),
(6,'SAE403','customuser'),
(10,'SAE403','deposit'),
(9,'SAE403','transfer'),
(8,'SAE403','withdrawal'),
(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES
(1,'contenttypes','0001_initial','2023-06-24 12:49:16.803493'),
(2,'contenttypes','0002_remove_content_type_name','2023-06-24 12:49:16.872531'),
(3,'auth','0001_initial','2023-06-24 12:49:17.125106'),
(4,'auth','0002_alter_permission_name_max_length','2023-06-24 12:49:17.175568'),
(5,'auth','0003_alter_user_email_max_length','2023-06-24 12:49:17.206912'),
(6,'auth','0004_alter_user_username_opts','2023-06-24 12:49:17.236353'),
(7,'auth','0005_alter_user_last_login_null','2023-06-24 12:49:17.255587'),
(8,'auth','0006_require_contenttypes_0002','2023-06-24 12:49:17.267121'),
(9,'auth','0007_alter_validators_add_error_messages','2023-06-24 12:49:17.283887'),
(10,'auth','0008_alter_user_username_max_length','2023-06-24 12:49:17.315889'),
(11,'auth','0009_alter_user_last_name_max_length','2023-06-24 12:49:17.332516'),
(12,'auth','0010_alter_group_name_max_length','2023-06-24 12:49:17.369244'),
(13,'auth','0011_update_proxy_permissions','2023-06-24 12:49:17.391655'),
(14,'auth','0012_alter_user_first_name_max_length','2023-06-24 12:49:17.421401'),
(15,'SAE403','0001_initial','2023-06-24 12:49:17.743302'),
(16,'SAE403','0002_alter_compte_date_created_and_more','2023-06-24 12:49:17.856832'),
(17,'SAE403','0003_alter_compte_date_created_and_more','2023-06-24 12:49:17.953714'),
(18,'SAE403','0004_alter_compte_date_created_and_more','2023-06-24 12:49:18.040574'),
(19,'SAE403','0005_alter_compte_date_created_and_more','2023-06-24 12:49:18.096080'),
(20,'SAE403','0006_rename_somme_compte_balance','2023-06-24 12:49:18.159315'),
(21,'SAE403','0007_account_delete_compte','2023-06-24 12:49:18.258304'),
(22,'SAE403','0008_alter_account_client_alter_account_name_withdrawal_and_more','2023-06-24 12:49:18.704519'),
(23,'admin','0001_initial','2023-06-24 12:49:18.860359'),
(24,'admin','0002_logentry_remove_auto_add','2023-06-24 12:49:18.908537'),
(25,'admin','0003_logentry_add_action_flag_choices','2023-06-24 12:49:18.949976'),
(26,'sessions','0001_initial','2023-06-24 12:49:18.987380');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-24 14:53:33
