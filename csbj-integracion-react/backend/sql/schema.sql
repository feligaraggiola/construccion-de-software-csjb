-- =========================================================
-- CSBJ — Esquema de base de datos (MySQL)
-- Basado en el Diagrama de Clases del proyecto (Usuario)
-- =========================================================

CREATE DATABASE IF NOT EXISTS csbj CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE csbj;

CREATE TABLE IF NOT EXISTS usuarios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nro_socio       VARCHAR(20)  NOT NULL UNIQUE,
  nombre          VARCHAR(100) NOT NULL,
  apellido        VARCHAR(100) NOT NULL,
  dni             VARCHAR(20)  NOT NULL UNIQUE,
  email           VARCHAR(150) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  telefono        VARCHAR(30)  NULL,
  pais            VARCHAR(60)  DEFAULT 'Argentina',
  provincia       VARCHAR(60)  NULL,
  localidad       VARCHAR(60)  NULL,
  dpto            VARCHAR(60)  NULL,
  domicilio       VARCHAR(150) NULL,
  categoria       VARCHAR(40)  DEFAULT 'Activo Pleno',
  fecha_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_baja      TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB;

-- Usuario de prueba (contraseña: "socio123")
-- El hash se genera con password_hash() de PHP, este es solo un ejemplo ilustrativo.
-- Para insertar un usuario real, usá el endpoint /api/registro.php en vez de este INSERT.
