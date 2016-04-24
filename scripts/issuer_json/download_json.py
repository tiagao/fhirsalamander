#!/usr/bin/env python

# Downloads JSON files from certain issuers
# Index schema here: https://github.com/CMSgov/QHP-provider-formulary-APIs/blob/master/index_document_schema.json
# { "provider_urls": [urls], "formulary_urls": [urls], "plan_urls": [urls] }

import collections
import csv
import json
import os
import time
import urllib2

BASE_DIR_NAME = 'data'
PROVIDER_URLS_DIR_NAME = 'provider_urls'
PLAN_URLS_DIR_NAME = 'plan_urls'
INDEX_FILE_NAME = 'index.json'

IssuerJsonRecord = collections.namedtuple('IssuerJsonIndex', ['state', 'issuer_id', 'issuer_name', 'url'])

def make_dir_if_not_exists(dir_path):
  if not os.path.isdir(dir_path):
    os.mkdir(dir_path)

def get_json_from_url(url):
  url_file = urllib2.urlopen(url)
  return json.load(url_file)

def get_json_from_file(path):
  json_obj = None
  with open(path, 'r') as json_file:
    json_obj = json.load(json_file)
  return json_obj

def write_json_to_path(json_obj, path):
  with open(path, 'w') as json_file:
    json.dump(json_obj, json_file, indent=2)

def save_json_from_url_list(json_urls, issuer_path, dest_dir_name):
  last_url = len(json_urls) - 1
  for i, json_url in enumerate(json_urls):
    dest_dir_path = os.path.join(issuer_path, dest_dir_name)
    make_dir_if_not_exists(dest_dir_path)

    json_path = os.path.join(dest_dir_path, '{}.json'.format(i))

    if not os.path.isfile(json_path):
      print '  Getting {} JSON {} / {}...'.format(dest_dir_name, i, last_url)

      json_obj = get_json_from_url(json_url)
      write_json_to_path(json_obj, json_path)

      time.sleep(1)

# Read in the issuers and their URLs from the CSV

issuer_json_records = None

with open('issuer_json_index_urls_VA.csv', 'r') as csvfile:
  reader = csv.DictReader(csvfile)
  issuer_json_records = [IssuerJsonRecord(state=row['State'],
                                          issuer_id=row['Issuer ID'],
                                          issuer_name=row['Issuer Name'],
                                          url=row['URL Submitted']) for row in reader]

if not issuer_json_records:
  raise Exception('Could not read issuer_json_records')

# Remove duplicate index JSON URLs

# issuer_json_records.sort(key=lambda record: record.issuer_id)
# issuer_json_records_deduped = []
# known_index_urls = {}
# for issuer_json_record in issuer_json_records:
#   if not known_index_urls.has_key(issuer_json_record.url):
#     known_index_urls[issuer_json_record.url] = True
#     issuer_json_records_deduped.append(issuer_json_record)
# issuer_json_records = issuer_json_records_deduped

print 'Found {} issuer_json_records...'.format(len(issuer_json_records))

# Download JSON files

make_dir_if_not_exists(BASE_DIR_NAME)

last_issuer_json_record = len(issuer_json_records) - 1

for i, issuer_json_record in enumerate(issuer_json_records):
  state_path = os.path.join(BASE_DIR_NAME, issuer_json_record.state)
  make_dir_if_not_exists(state_path)

  issuer_path = os.path.join(state_path, issuer_json_record.issuer_id)
  make_dir_if_not_exists(issuer_path)

  index_json_path = os.path.join(issuer_path, INDEX_FILE_NAME)
  index_json = None

  if os.path.isfile(index_json_path):
    print 'Found existing {}, index JSON for issuer {} ({}/{})'.format(index_json_path,
                                                                       issuer_json_record.issuer_id,
                                                                       i,
                                                                       last_issuer_json_record)
    index_json = get_json_from_file(index_json_path)
  else:
    print 'Getting index JSON from URL {} for issuer {} ({}/{})...'.format(issuer_json_record.url,
                                                                           issuer_json_record.issuer_id,
                                                                           i,
                                                                           last_issuer_json_record)
    try:
      index_json = get_json_from_url(issuer_json_record.url)
      write_json_to_path(index_json, index_json_path)
    except:
      print "*** FAILED getting index JSON for issuer {}! ***".format(issuer_json_record.issuer_id)

  if index_json:
    # try:
    #   save_json_from_url_list(index_json['provider_urls'][0:1], issuer_path, PROVIDER_URLS_DIR_NAME)
    # except:
    #   print "*** FAILED getting provider JSONs for issuer {}! ***".format(issuer_json_record.issuer_id)

    try:
      save_json_from_url_list(index_json['plan_urls'], issuer_path, PLAN_URLS_DIR_NAME)
    except:
      print "*** FAILED getting plan JSONs for issuer {}! ***".format(issuer_json_record.issuer_id)
