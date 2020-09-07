/*
SQLyog Community v13.1.5  (64 bit)
MySQL - 5.5.62 : Database - learners
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`learners` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `learners`;

/*Table structure for table `learnerdetails` */

DROP TABLE IF EXISTS `learnerdetails`;

CREATE TABLE `learnerdetails` (
  `learner_id` int(10) NOT NULL AUTO_INCREMENT,
  `learner_name` varchar(100) CHARACTER SET latin1 NOT NULL,
  `learner_email` varchar(100) CHARACTER SET latin1 NOT NULL,
  `course_Id` int(10) NOT NULL,
  PRIMARY KEY (`learner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

/*Data for the table `learnerdetails` */

insert  into `learnerdetails`(`learner_id`,`learner_name`,`learner_email`,`course_Id`) values 
(1,'jayant kumar','jaykrs@gmail.com',45),
(2,'jay Kumar','jaykrs@hotmail.com',76),
(4,'Ravish Kumar','ravish@hotmail.com',961);

/* Procedure structure for procedure `GetOfficeByCountry` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetOfficeByCountry` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `GetOfficeByCountry`(
	IN _learner_id INT
)
BEGIN
	SELECT * 
 	FROM learnerdetails
	WHERE learner_id = _learner_id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `learnerAddOrEdit` */

/*!50003 DROP PROCEDURE IF EXISTS  `learnerAddOrEdit` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `learnerAddOrEdit`(
IN _learner_id INT,
IN _learner_name VARCHAR(45),
IN _learner_email VARCHAR(45),
IN _course_Id INT
)
BEGIN
IF _learner_id = 0 THEN
INSERT INTO learnerdetails(learner_name,learner_email,course_Id)
VALUES (_learner_name,_learner_email,_course_Id);
SET _learner_id = last_insert_id();
ELSE
UPDATE learnerdetails
SET
learner_name = _learner_name,
learner_email = _learner_email,
course_Id = _course_Id
WHERE learner_id = _learner_id;
END IF;
SELECT _learner_id AS 'learner_id';
END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
