#!/usr/bin/env python

# Import a JSON file and write it out in a nicer form in a different file

import argparse
import json

parser = argparse.ArgumentParser('Import a JSON file and write it out to a different file')
parser.add_argument('input_path', help='Input path')
parser.add_argument('output_path', help='Output path')
args = parser.parse_args()

print "Reading {} and writing to {}...".format(args.input_path, args.output_path)

with open(args.input_path, 'r') as input_file:
  json_obj = json.load(input_file)
  with open(args.output_path, 'w') as output_file:
    json.dump(json_obj, output_file, indent=2)
