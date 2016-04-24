#!/usr/bin/env python

# Turn Issuer JSON files into CSVs suitable for LOAD DATA INFILE
#
# LOAD DATA INFILE "data/Plans.csv"
# 	IGNORE INTO TABLE Plans
# 	FIELDS TERMINATED BY ','
#     ENCLOSED BY '"'
#     LINES TERMINATED BY '\r\n';

import argparse
import csv
import glob
import json
import os

ACCEPTING = 0
NOT_ACCEPTING = 1
ACCEPTING_IN_SOME_LOCATIONS = 2

BASE_DIR_NAME = 'data'

parser = argparse.ArgumentParser('Turn the Issuer JSON files into CSVs for MySQL')
parser.add_argument('data_dir', help='Folder with the JSON files')
args = parser.parse_args()

def make_dir_if_not_exists(dir_path):
  if not os.path.isdir(dir_path):
    os.mkdir(dir_path)

def get_json_from_file(path):
  json_obj = None
  with open(path, 'r') as json_file:
    json_obj = json.load(json_file)
  return json_obj

def write_csv(rows, path):
  with open(path, 'w') as csv_file:
    writer = csv.writer(csv_file, quoting=csv.QUOTE_ALL)
    for row in rows:
      try:
        writer.writerow(row)
      except Exception as e:
        print "ERROR WRITING ROW to {}!".format(path)

def make_row_with_defaults(obj, fields):
  return [obj.get(field, '') for field in fields]

# Base dir

make_dir_if_not_exists(BASE_DIR_NAME)

# Write plan data

print "Writing plan data..."

plan_json_paths = glob.glob(os.path.join(args.data_dir, "*/plan_urls/*.json"))

plans_output_path = os.path.join(BASE_DIR_NAME, "Plans.csv")

plan_rows = []

for plan_json_path in plan_json_paths:
  plans = get_json_from_file(plan_json_path)
  for plan in plans:
    plan_rows.append(make_row_with_defaults(plan, ['plan_id', 'marketing_name', 'summary_url']))

write_csv(plan_rows, plans_output_path)

# Write provider data

print "Writing provider data..."

provider_json_paths = glob.glob(os.path.join(args.data_dir, "*/provider_urls/*.json"))

providers_output_path = os.path.join(BASE_DIR_NAME, "Providers.csv")
individual_providers_output_path = os.path.join(BASE_DIR_NAME, "IndividualProviders.csv")
individual_provider_specialties_output_path = os.path.join(BASE_DIR_NAME, "IndividualProviderSpecialties.csv")
individual_provider_languages_output_path = os.path.join(BASE_DIR_NAME, "IndividualProviderLanguages.csv")
facility_providers_output_path = os.path.join(BASE_DIR_NAME, "FacilityProviders.csv")
facility_provider_types_output_path = os.path.join(BASE_DIR_NAME, "FacilityProviderTypes.csv")
provider_addresses_output_path = os.path.join(BASE_DIR_NAME, "ProviderAddresses.csv")
provider_plans_output_path = os.path.join(BASE_DIR_NAME, "ProviderPlans.csv")

providers_rows = []
individual_providers_rows = []
individual_provider_specialties_rows = []
individual_provider_languages_rows = []
facility_providers_rows = []
facility_provider_types_rows = []
provider_addresses_rows = []
provider_plans_rows = []

last_json_file = len(provider_json_paths) - 1

for i, provider_json_path in enumerate(provider_json_paths):
  print "Writing provider data for JSON file {} ({}/{})...".format(provider_json_path, i, last_json_file)

  providers = get_json_from_file(provider_json_path)
  for provider in providers:
    npi = provider.get('npi', None)
    provider_type = provider.get('type', None)
    if npi and (provider_type == 'INDIVIDUAL' or provider_type == 'FACILITY'):
      # Providers
      providers_rows.append(make_row_with_defaults(provider, ['npi', 'last_updated_on']))

      # ProviderAddresses
      for address in provider.get('addresses', []):
        row = [npi]
        row.extend(make_row_with_defaults(address, ['address', 'address_2', 'city', 'state', 'zip', 'phone']))
        provider_addresses_rows.append(row)

      # ProviderPlans
      for plan in provider.get('plans', []):
        row = [npi]
        row.extend(make_row_with_defaults(plan, ['plan_id']))
        provider_plans_rows.append(row)

      if provider_type == 'INDIVIDUAL':
        # IndividualProviders
        name = provider.get('name', {})
        name_first = name.get('first', '')
        name_last = name.get('last', '')
        accepting_string = provider.get('accepting', '')
        accepting = NOT_ACCEPTING
        if accepting_string == 'accepting':
          accepting = ACCEPTING
        elif accepting_string == 'not accepting':
          accepting = NOT_ACCEPTING
        elif accepting_string == 'accepting in some locations':
          accepting = ACCEPTING_IN_SOME_LOCATIONS
        individual_providers_rows.append([npi, name_first, name_last, accepting])

        # IndividualProviderSpecialties
        for speciality in provider.get('speciality', []):
          individual_provider_specialties_rows.append([npi, speciality])

        # IndividualProviderLanguages
        for language in provider.get('languages', []):
          individual_provider_languages_rows.append([npi, language])
      elif provider_type == 'FACILITY':
        # FacilityProviders
        row = [npi]
        row.extend(make_row_with_defaults(provider, ['facility_name']))
        facility_providers_rows.append(row)

        # FacilityProviderTypes
        for facility_type in provider.get('facility_type', []):
          facility_provider_types_rows.append([npi, facility_type])

write_csv(providers_rows, providers_output_path)
write_csv(individual_providers_rows, individual_providers_output_path)
write_csv(individual_provider_specialties_rows, individual_provider_specialties_output_path)
write_csv(individual_provider_languages_rows, individual_provider_languages_output_path)
write_csv(facility_providers_rows, facility_providers_output_path)
write_csv(facility_provider_types_rows, facility_provider_types_output_path)
write_csv(provider_addresses_rows, provider_addresses_output_path)
write_csv(provider_plans_rows, provider_plans_output_path)
