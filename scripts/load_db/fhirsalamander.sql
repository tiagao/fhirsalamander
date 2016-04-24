USE fhirsalamander;

CREATE TABLE Plans(
	plan_id VARCHAR(128) PRIMARY KEY NOT NULL,
    marketing_name VARCHAR(1024) NULL,
    summary_url VARCHAR(1024) NULL,
    INDEX(marketing_name)
);

CREATE TABLE Providers(
	npi VARCHAR(16) PRIMARY KEY NOT NULL,
    last_updated_on DATE NOT NULL
);

CREATE TABLE IndividualProviders(
	npi VARCHAR(16) PRIMARY KEY NOT NULL,
    name_first VARCHAR(1024) NOT NULL,
    name_last VARCHAR(1024) NOT NULL,
    accepting TINYINT UNSIGNED NOT NULL,
    INDEX(name_first),
    INDEX(name_last),
    INDEX(accepting),
    FOREIGN KEY (npi) REFERENCES Providers(npi) ON DELETE CASCADE
);

CREATE TABLE IndividualProviderSpecialties(
	npi VARCHAR(16) NOT NULL,
    speciality VARCHAR(256) NOT NULL,
    INDEX(speciality),
    PRIMARY KEY(npi, speciality),
    FOREIGN KEY (npi) REFERENCES Providers(npi) ON DELETE CASCADE
);

CREATE TABLE IndividualProviderLanguages(
	npi VARCHAR(16) NOT NULL,
    lang VARCHAR(256) NOT NULL,
    INDEX(lang),
    PRIMARY KEY(npi, lang),
    FOREIGN KEY (npi) REFERENCES Providers(npi) ON DELETE CASCADE
);

CREATE TABLE FacilityProviders(
	npi VARCHAR(16) PRIMARY KEY NOT NULL,
    facility_name VARCHAR(1024) NOT NULL,
    INDEX(facility_name),
    FOREIGN KEY (npi) REFERENCES Providers(npi) ON DELETE CASCADE
);

CREATE TABLE FacilityProviderTypes(
	npi VARCHAR(16) NOT NULL,
    facility_type VARCHAR(256) NOT NULL,
    INDEX(facility_type),
    PRIMARY KEY(npi, facility_type),
    FOREIGN KEY (npi) REFERENCES Providers(npi) ON DELETE CASCADE
);

CREATE TABLE ProviderAddresses(
	npi VARCHAR(16) NOT NULL,
    address VARCHAR(1024) NOT NULL,
    address_2 VARCHAR(1024) NULL,
    city VARCHAR(1024) NOT NULL,
    state VARCHAR(64) NOT NULL,
    zip VARCHAR(16) NOT NULL,
    phone VARCHAR(16) NOT NULL,
	FOREIGN KEY (npi) REFERENCES Providers(npi) ON DELETE CASCADE
);

CREATE TABLE ProviderPlans(
	npi VARCHAR(16) NOT NULL,
    plan_id VARCHAR(128) NOT NULL,
    PRIMARY KEY (npi, plan_id),
    FOREIGN KEY (npi) REFERENCES Providers(npi) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id) ON DELETE CASCADE
);