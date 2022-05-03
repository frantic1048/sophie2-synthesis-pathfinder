#!/usr/bin/env python3

import sys
import csv
import pprint
import json


def usage():
    print(
        "Usage:\n\t",
        sys.argv[0],
        '"Atelier Sophie 2 - Item Data.csv" "Atelier Sophie 2 - Item Effects.csv" "Atelier Sophie 2 - Trait.csv"',
    )


# Item Effects table, Item Data table
# (Dragon Mat.)    -> (dragon-mat)
def normalize_ingredient(input):
    return str.lower(input).replace(".)", ")").replace(" ", "-")


def is_category_ingredient(input):
    return input.startswith("(")


def make_edge_id(source, target):
    return "edge__" + source + "__" + target


def make_category_id(category_name):
    return "(" + category_name + ")"


# TODO: find correct match
# trait_kind_list = [
#     Exp
#     Synth MIX
#     Bomb ATTACK
#     Heal HEAL
#     Debuff DEBUFFER
#     Buff BUFFER
#     Wep WEAPON
#     Arm ARMOR
#     Acc ACCESSORY
#     Tali AMULET
#     ###
#     MATERIAL
#     ATTACK
#     HEAL
#     BUFFER
#     DEBUFFER
#     FIELD
#     FIELD_TOOL
#     MIX
#     WEAPON
#     ARMOR
#     ACCESSORY
#     AMULET
#     IMPORTANT
#     BOOK
# ]

items = {}
edges = {}

traits = {}
trait_edges = {}

if __name__ == "__main__":
    if len(sys.argv) != 4:
        usage()
        sys.exit(1)

    [item_data_file_name, item_effect_file_name, trait_file_name] = sys.argv[1:]

    with open(item_data_file_name, newline="") as csvfile:
        spamreader = csv.reader(csvfile)
        for row in [r for r in spamreader if r[0] != ""][0:]:
            name = row[0]
            kind = row[4]
            cat = [c for c in row[5:9] if c != ""]
            items[name] = {"id": name, "name": name, "kind": kind, "categoryList": cat}
            for c in cat:
                category_id = make_category_id(c)
                edge_id = make_edge_id(category_id, name)
                edges[edge_id] = {
                    "id": edge_id,
                    "source": category_id,
                    "target": name,
                }

    with open(item_effect_file_name, newline="") as csvfile:
        spamreader = csv.reader(csvfile)
        for row in [r for r in spamreader if r[1] != "" and r[5] != ""][1:]:
            item = row[1]
            ingredient = normalize_ingredient(row[5])

            items[item]["isSynthesizable"] = True
            isCategory = is_category_ingredient(ingredient)
            if isCategory:
                items[ingredient] = {
                    "id": ingredient,
                    "name": ingredient,
                    "isCategory": True,
                }
            edge_id = make_edge_id(item, ingredient)
            edges[edge_id] = {
                "id": edge_id,
                "source": item,
                "target": ingredient,
                "hasCategory": isCategory,
            }

    with open(trait_file_name, newline="") as csvfile:
        spamreader = csv.reader(csvfile)
        for row in [r for r in spamreader if r[0] != ""][1:]:
            name = row[0]
            grade = row[2]
            kind_list = row[3:13]  # TODO: process kind_list
            combo_list = [c for c in row[13:15] if c != ""]
            traits[name] = {
                "id": name,
                "name": name,
                "grade": grade
            }
            for c in combo_list:
                edge_id = make_edge_id(name, c)
                trait_edges[edge_id] = {"id": edge_id, "source": name, "target": c}

    print(
        "// Generated by "
        + sys.argv[0]
        + "\n// DO NOT EDIT BY HAND!\nexport const data=`"
        + json.dumps(
            {
                "items": items,
                "edges": edges,
                "traits": traits,
                "traitEdges": trait_edges,
            }
        )
        + "`"
    )
