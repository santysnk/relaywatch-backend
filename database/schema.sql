-- =====================================================
-- RelayWatch v2 — Esquema de base de datos
-- MySQL 8.x  |  Charset: utf8mb4
-- =====================================================

CREATE DATABASE IF NOT EXISTS relaywatch
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE relaywatch;


-- -----------------------------------------------------
-- 1. USUARIOS
-- -----------------------------------------------------
CREATE TABLE usuarios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100)  NOT NULL,
  apellido        VARCHAR(100)  NOT NULL,
  email           VARCHAR(255)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255)  NOT NULL,
  rol             ENUM('admin', 'invitado') NOT NULL DEFAULT 'invitado',
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- 2. TITULOS_PANELES
--    Catálogo de títulos disponibles para los paneles superior/inferior
--    de los registradores. La fila con id=1 ("Sin determinar") es el
--    default usado cuando no se asigna un título explícito.
-- -----------------------------------------------------
CREATE TABLE titulos_paneles (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  nombre  VARCHAR(100)  NOT NULL UNIQUE
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- 3. REGISTRADORES
--    Cada fila es un equipo (relé o analizador).
-- -----------------------------------------------------
CREATE TABLE registradores (
  id                        INT AUTO_INCREMENT PRIMARY KEY,
  nombre                    VARCHAR(45)   NOT NULL UNIQUE,
  tipo                      ENUM('rele', 'analizador') NOT NULL,
  head_color                VARCHAR(7)    NOT NULL DEFAULT '#4180ab',  -- hex, ej "#FF5733"
  ip                        VARCHAR(45)   NOT NULL UNIQUE,
  puerto                    INT           NOT NULL,
  indice_inicial            INT           NOT NULL,
  cantidad_registros        INT           NOT NULL,
  periodo_segundos          INT           NOT NULL DEFAULT 60,
  panel_superior            BOOLEAN       NOT NULL DEFAULT TRUE,
  id_titulo_panel_superior  INT           NOT NULL DEFAULT 1,
  panel_inferior            BOOLEAN       NOT NULL DEFAULT TRUE,
  id_titulo_panel_inferior  INT           NOT NULL DEFAULT 1,
  activo                    BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at                TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at                TIMESTAMP     NULL DEFAULT NULL,  -- soft delete: NULL = vivo; con fecha = eliminado (las lecturas se conservan)

  CONSTRAINT fk_reg_titulo_sup
    FOREIGN KEY (id_titulo_panel_superior) REFERENCES titulos_paneles(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_reg_titulo_inf
    FOREIGN KEY (id_titulo_panel_inferior) REFERENCES titulos_paneles(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- 4. PARAMETROS
--    Catálogo de magnitudes medibles. Cada parámetro tiene un índice
--    fijo dentro del array de lecturas (definido por el simulador o,
--    en el futuro, por el JSON real del relé). El UNIQUE compuesto
--    (nombre, indice_parametro) permite repetir un mismo nombre en
--    distintos índices, soportando distintas marcas de relé donde una
--    misma magnitud pueda llegar en posiciones diferentes.
-- -----------------------------------------------------
CREATE TABLE parametros (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(50)  NOT NULL,
  unidad            VARCHAR(10)  NOT NULL,
  indice_parametro  INT          NOT NULL,
  CONSTRAINT uq_parametro_nombre_indice UNIQUE (nombre, indice_parametro)
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- 5. RELACIONES_TRANSFORMACION
--    Catálogo de relaciones TT/TC reutilizables.
-- -----------------------------------------------------
CREATE TABLE relaciones_transformacion (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  relacion  VARCHAR(50)  NOT NULL                 -- "13800/110", "100/5"
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- 6. CONFIG_REGISTRADOR  (tabla intermedia)
--    Asocia un registrador con cada parámetro que mide
--    y la relación de transformación a aplicar (si corresponde).
-- -----------------------------------------------------
CREATE TABLE config_registrador (
  id                          INT AUTO_INCREMENT PRIMARY KEY,
  id_registrador              INT NOT NULL,
  id_parametro                INT NOT NULL,
  id_relacion_transformacion  INT NULL,
  panel                       ENUM('superior','inferior') NOT NULL DEFAULT 'superior',
  orden                       INT NOT NULL DEFAULT 0,

  CONSTRAINT fk_cr_registrador
    FOREIGN KEY (id_registrador) REFERENCES registradores(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_cr_parametro
    FOREIGN KEY (id_parametro) REFERENCES parametros(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_cr_relacion
    FOREIGN KEY (id_relacion_transformacion) REFERENCES relaciones_transformacion(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT uq_registrador_parametro
    UNIQUE (id_registrador, id_parametro)
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- 7. LECTURAS  (histórico de mediciones)
--    Una fila por (registrador, parámetro, created_at).
--    El backend ejecuta una limpieza periódica (>7 días).
-- -----------------------------------------------------
CREATE TABLE lecturas (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_registrador  INT            NOT NULL,
  id_parametro    INT            NOT NULL,
  valor           DECIMAL(15,4)  NOT NULL,
  created_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_lec_registrador
    FOREIGN KEY (id_registrador) REFERENCES registradores(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_lec_parametro
    FOREIGN KEY (id_parametro) REFERENCES parametros(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  INDEX idx_lecturas_reg_created  (id_registrador, created_at),
  INDEX idx_lecturas_created      (created_at)
) ENGINE=InnoDB;


-- =====================================================
-- SEEDS iniciales
-- =====================================================

-- "Sin determinar" va PRIMERO para que quede con id=1 — es el default
-- de id_titulo_panel_superior / id_titulo_panel_inferior en registradores.
INSERT INTO titulos_paneles (nombre) VALUES
  ('Sin determinar'),
  ('Tensión de línea (en 33kV)'),
  ('Tensión de línea (en 13,2kV)'),
  ('Corriente de línea (en 33kV)'),
  ('Corriente de línea (en 13,2kV)');

-- Catálogo de parámetros base. El indice_parametro es la dirección Modbus
-- (1-based) del registro en el relé REF615 de ABB, según su manual de point
-- list. El simulador genera valores en estas direcciones y el orquestador
-- accede como array[indice_parametro - 1] (los arrays arrancan en 0).
--   Corrientes IL1/IL2/IL3 → 138, 139, 140
--   Tensiones  U1/U2/U3    → 152, 153, 154
INSERT INTO parametros (nombre, unidad, indice_parametro) VALUES
  ('Tensión R',   'kV', 152),
  ('Tensión S',   'kV', 153),
  ('Tensión T',   'kV', 154),
  ('Corriente R', 'A',  138),
  ('Corriente S', 'A',  139),
  ('Corriente T', 'A',  140);

-- Usuario administrador inicial (bootstrap del primer admin).
-- Queda con id=1 por ser el primer INSERT en la tabla.
--   Email:    admin@relaywatch.com
--   Password: 12345678   (hasheada con bcrypt, salt rounds = 10)
-- IMPORTANTE: en un entorno real, cambiar esta contraseña tras el primer login.
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol) VALUES
  ('Admin', 'Principal', 'admin@relaywatch.com',
   '$2b$10$fOFWQx5.gRkiu7j86mxu0OQ3aaYZhV5AlOD2I.EopY5lc8dMICFda', 'admin');
