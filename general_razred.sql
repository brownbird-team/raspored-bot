-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 15, 2022 at 12:23 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rasporedgit`
--

-- --------------------------------------------------------

--
-- Table structure for table `general_razred`
--

CREATE TABLE `general_razred` (
  `id` int(11) NOT NULL,
  `ime` char(10) NOT NULL,
  `smjena` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `general_razred`
--

INSERT INTO `general_razred` (`id`, `ime`, `smjena`) VALUES
(1, '1.A', 'A'),
(2, '1.B', 'A'),
(3, '1.C', 'A'),
(4, '1.D', 'A'),
(5, '1.O', 'A'),
(6, '2.A', 'A'),
(7, '2.B', 'A'),
(8, '2.C', 'A'),
(9, '2.D', 'A'),
(10, '2.O', 'A'),
(11, '3.A', 'A'),
(12, '3.B', 'A'),
(13, '3.C', 'A'),
(14, '3.D', 'A'),
(15, '3.O', 'A'),
(16, '4.A', 'A'),
(17, '4.B', 'A'),
(18, '4.C', 'A'),
(19, '4.D', 'A'),
(20, '4.O', 'A'),
(21, '1.E', 'B'),
(22, '1.F', 'B'),
(23, '1.G', 'B'),
(24, '1.M', 'B'),
(25, '1.N', 'B'),
(26, '2.E', 'B'),
(27, '2.F', 'B'),
(28, '2.G', 'B'),
(29, '2.M', 'B'),
(30, '2.N', 'B'),
(31, '3.E', 'B'),
(32, '3.F', 'B'),
(33, '3.G', 'B'),
(34, '3.M', 'B'),
(35, '3.N', 'B'),
(36, '4.F', 'B'),
(37, '4.G', 'B'),
(38, '4.H', 'B'),
(39, '4.M', 'B'),
(40, '4.N', 'B');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `general_razred`
--
ALTER TABLE `general_razred`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `general_razred`
--
ALTER TABLE `general_razred`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
