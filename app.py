# Import the functions we need from flask
from flask import Flask
from flask import render_template 
from flask import jsonify

# Import the functions we need from SQL Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import numpy as np

import pandas as pd

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///backpackers_index.db",
                        echo=True,
                        connect_args={"check_same_thread": False})

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
coords = Base.classes.COORDS
facts = Base.classes.CITY_FACTS
food_drinks = Base.classes.FOOD_DRINKS
hotel_tbl = Base.classes.HOTEL
hostel_tbl = Base.classes.HOSTEL
transport_tbl = Base.classes.TRANSPORTATION
climate_data = Base.classes.TEMP_PRCP
intro_data = Base.classes.INTRO

#################################################
# Flask Routes
#################################################


@app.route("/")
def IndexRoute():
    webpage = render_template("index.html")
    return webpage

# Route to our dashboard page
@app.route("/Dashboard.html")
def dashboard():
    print("works fine in Dashboard.html")
    return render_template("Dashboard.html")

@app.route("/Dashboard3.html")
def dashboard3():
    print("works fine in Dashboard3.html")
    return render_template("Dashboard3.html")

# Route to our comparison page
@app.route("/Comparison.html")
def comparison():
    print("works fine in Comparison.html")
    return render_template("Comparison.html")

# Route to our team page
@app.route("/Team.html")
def team():
    print("works fine in Team.html")
    return render_template("Team.html")


# @app.route("/other")
# def welcome():
#     """List all available api routes."""
#     return (
#         "Available Routes:<br/>"
#         "/api/v1.0/COORDS<br/>"
#         "/api/v1.0/CITY_FACTS"
#     )

#####################################################
# These routes are created to get data from database
#####################################################

@app.route("/api/v1.0/coordsData")
def coordsRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    #Return a list of all cities +lat + long"""
    
    city_coords = session.query(coords.city_country, coords.lat, coords.lon).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_coords = []
    for row in city_coords:
        all_coords.append({"city_country": row[0],
                           "lat": row[1],
                           "lon": row[2]})
 
    return jsonify(all_coords)

    # cityCoordList = ["CITY_COUNTRY", "LAT", "LON"]
    # all_coords = {}
    # for item in city_coords:
    #     CITY_COUNTRY = item[0]
    #     LAT = item[1]
    #     LON = item[2]
    #     for key in all_coords:
    #         if CITY_COUNTRY == key:
    #             for city in cityCoordList:
    #                 test = {city: LAT} 
    #                 all_coords[key] [CITY_COUNTRY] = {"coords": test}
    #                 found = True
    #             if not found:
    #                 for city in ityCoordList:
    #                     test = {city: LAT}
    #                 all_coords[CITY_COUNTRY] = { CITY_COUNTRY: {"coords": test}}

    # return all_coords

@app.route("/api/v1.0/facts")
def factsRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    #Return a list of cities + facts
    city_facts = session.query(facts.city_country, facts.rank, facts.daily_total_value, facts.population, facts.metro, facts.timezone, facts.currency, facts.airport ).all()
    session.close()
    # Create a dictionary from the row data and append to a list of all_facts
    all_cities = []
    for row in city_facts:
        all_cities.append({"city_country": row[0],
                           "rank": row[1],
                           "daily_total_value": row[2],
                           "population": row[3],
                           "metro": row[4],
                           "timezone": row[5],
                           "currency": row[6],
                           "airport": row[7]})
        # city_dict = {}
        # city_dict["CITY_COUNTRY"] = NAME
        # city_dict["RANK"] = RANK
        # city_dict["DAILY_TOTAL_VALUE"] = DAILY_TOTAL_VALUE
        # city_dict["POPULATION"] = POPULATION
        # city_dict["METRO"] = METRO
        # city_dict["TIMEZONE"] = TIMEZONE
        # city_dict["CURRENCY"] = CURRENCY
        # city_dict["AIRPORT"] = AIRPORT
        # all_cities.append(city_dict)

    return jsonify(all_cities)

@app.route("/api/v1.0/comparison")
def compRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Return a list of dictionaries with food and drinks, hotel, hostel, and transportation
    fnb = session.query(food_drinks.city_country, food_drinks.food_drinks_type, food_drinks.food_drinks_lower_price, food_drinks.food_drinks_upper_price).all()
    hotel = session.query(hotel_tbl.city_country, hotel_tbl.hotel_ratings, hotel_tbl.hotel_lower_price, hotel_tbl.hotel_upper_price).all()
    hostel = session.query(hostel_tbl.city_country, hostel_tbl.hostel_lower_price, hostel_tbl.hostel_upper_price).all()
    session.close()
   
    # Create multiple lists to store queried data
    
    # food and drinks
    budget_breakfast = []
    budget_lunch = []
    budget_dinner = []

    # hotel
    one_star = []
    two_star = []
    three_star = []
    four_star = []
    five_star = []

    # hostel
    hostel_list = []

    for row in fnb:
        if row[1] == "Budget breakfast":
            price_range = []
            price_range.append(row[2])
            price_range.append(row[3])
            budget_breakfast.append({"y": price_range,
                            "label": row[0]
                            })

        if row[1] == "Budget lunch":
            price_range = []
            price_range.append(row[2])
            price_range.append(row[3])
            budget_lunch.append({"y": price_range,
                            "label": row[0]
                            })

        if row[1] == "Budget dinner":
            price_range = []
            price_range.append(row[2])
            price_range.append(row[3])
            budget_dinner.append({"y": price_range,
                            "label": row[0]
                            })
    
    for row in hotel:
        if row[1] == "1_star":
            price_range = []
            price_range.append(row[2])
            price_range.append(row[3])
            one_star.append({"y": price_range,
                            "label": row[0]
                            })

        if row[1] == "2_stars":
            price_range = []
            price_range.append(row[2])
            price_range.append(row[3])
            two_star.append({"y": price_range,
                            "label": row[0]
                            })

        if row[1] == "3_stars":
            price_range = []
            price_range.append(row[2])
            price_range.append(row[3])
            three_star.append({"y": price_range,
                            "label": row[0]
                            })

        if row[1] == "4_stars":
            price_range = []
            price_range.append(row[2])
            price_range.append(row[3])
            four_star.append({"y": price_range,
                            "label": row[0]
                            })

        if row[1] == "5_stars":
            price_range = []
            price_range.append(row[2])
            price_range.append(row[3])
            five_star.append({"y": price_range,
                            "label": row[0]
                            })

    for row in hostel:    
        price_range = []
        price_range.append(row[1])
        price_range.append(row[2])
        hostel_list.append({"y": price_range,
                        "label": row[0]    
                    })

    dict = {}

    dict['budget_breakfast'] = budget_breakfast
    dict['budget_lunch'] = budget_lunch
    dict['budget_dinner'] = budget_dinner
    dict['one_star'] = one_star
    dict['two_star'] = two_star
    dict['three_star'] = three_star
    dict['four_star'] = four_star
    dict['five_star'] = five_star
    dict['hostel'] = hostel_list

    return jsonify(dict)

@app.route("/api/v1.0/citiesName")
def citiesNameRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Return a list of dictionaries with cities
    city_facts = session.query(facts.city_country).all()

    session.close()

    # Get the list of cities
    cities = []

    for row in city_facts:
        cities.append(row[0])

    return jsonify(cities)

@app.route("/api/v1.0/fnbData")
def fnbRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Return a list of dictionaries with food and drinks, hotel, hostel, and transportation
    fnb = session.query(food_drinks.city_country, food_drinks.food_drinks_type, food_drinks.food_drinks_lower_price, food_drinks.food_drinks_upper_price).all()
    city_facts = session.query(facts.city_country).all()

    session.close()

    # Get the list of cities
    cities = []

    for row in city_facts:
        cities.append(row[0])

    # Create a dictionary of the list of cities
    dict = {c: [] for c in cities}

    for row in fnb:
        for i in range (0, 137):
            if row[0] == cities[i]:
                name = cities[i]
                price_range = []
                price_range.append(row[2])
                price_range.append(row[3])
                dict[name].append({"y": price_range,
                                "label": row[1]
                                })

    return jsonify(dict)

@app.route("/api/v1.0/hotelData")
def hotelRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Return a list of dictionaries with food and drinks, hotel, hostel, and transportation
    hotel = session.query(hotel_tbl.city_country, hotel_tbl.hotel_ratings, hotel_tbl.hotel_lower_price, hotel_tbl.hotel_upper_price).all()
    city_facts = session.query(facts.city_country).all()

    session.close()

    # Get the list of cities
    cities = []

    for row in city_facts:
        cities.append(row[0])

    # Create a dictionary of the list of cities
    dict = {c: [] for c in cities}

    for row in hotel:
        for i in range (0, 137):
            if row[0] == cities[i]:
                name = cities[i]
                price_range = []
                price_range.append(row[2])
                price_range.append(row[3])
                dict[name].append({"y": price_range,
                                "label": row[1]
                                })

    return jsonify(dict)

@app.route("/api/v1.0/transportData")
def transportRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Return a list of dictionaries with food and drinks, hotel, hostel, and transportation
    transport = session.query(transport_tbl.city_country, transport_tbl.transport_mode, transport_tbl.transport_lower_price, transport_tbl.transport_upper_price).all()
    city_facts = session.query(facts.city_country).all()

    session.close()

    # Get the list of cities
    cities = []

    for row in city_facts:
        cities.append(row[0])

    # Create a dictionary of the list of cities
    dict = {c: [] for c in cities}

    for row in transport:
        for i in range (0, 137):
            if row[0] == cities[i]:
                name = cities[i]
                price_range = []
                price_range.append(row[2])
                price_range.append(row[3])
                dict[name].append({"y": price_range,
                                "label": row[1]
                                })

    # return jsonify(dict)
    return jsonify(dict)

@app.route("/api/v1.0/climate")
def climate():

    session = Session(engine)

    results = session.query(climate_data.city_country, 
                            climate_data.month, 
                            climate_data.high_temp,
                            climate_data.low_temp,
                            climate_data.prcp_inch,
                            ).all()

    session.close()


    all_climate = []
    for city_country, month, high_temp, low_temp, prcp_inch in results:
        climate_dict = {}
        climate_dict["city_country"] = city_country
        climate_dict["high_temp"] = high_temp
        climate_dict["low_temp"] = low_temp
        climate_dict["precipitation"] = prcp_inch
        all_climate.append(climate_dict)

    #Use pandas to clean data file
    my_climate_df = pd.DataFrame(all_climate)
    grouped_df = my_climate_df.groupby('city_country').mean().round().fillna(0).reset_index()
    avg_col = grouped_df.loc[:, "high_temp":"low_temp"]

    grouped_df['avg_temp'] = avg_col.mean(axis=1)
    avg_climate = grouped_df.drop(columns=["high_temp", "low_temp"])

    return avg_climate.to_json(orient='records')

@app.route("/api/v1.0/prcpData")
def prcpRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Return a list of dictionaries with food and drinks, hotel, hostel, and transportation
    prcp = session.query(climate_data.city_country, climate_data.month, climate_data.prcp_inch).all()
    city_facts = session.query(facts.city_country).all()

    session.close()

    # Get the list of cities
    cities = []

    for row in city_facts:
        cities.append(row[0])

    # Create a dictionary of the list of cities
    dict = {c: [] for c in cities}

    for row in prcp:
        for i in range (0, 137):
            if row[0] == cities[i]:
                name = cities[i]
                dict[name].append({"volume": row[2],
                                "month": row[1]
                                })

    return jsonify(dict)

@app.route("/api/v1.0/tempPrcp")
def tempPrcpRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Return a list of dictionaries with food and drinks, hotel, hostel, and transportation
    prcp = session.query(climate_data.city_country, climate_data.month, climate_data.high_temp, climate_data.low_temp, climate_data.prcp_inch).all()
    city_facts = session.query(facts.city_country).all()

    session.close()

    # Get the list of cities
    cities = []

    for row in city_facts:
        cities.append(row[0])

    # Create a dictionary of the list of cities
    dict = {c: [] for c in cities}

    for row in prcp:
        for i in range (0, 137):
            if row[0] == cities[i]:
                name = cities[i]
                temp = []
                temp.append(row[2])
                temp.append(row[3])
                dict[name].append({"temp": temp,
                                "month": row[1],
                                "volume": row[4]
                                })

    return jsonify(dict)

@app.route("/api/v1.0/intro")
def introRoute():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    #Return a list of cities + facts
    introduction = session.query(intro_data.city_country, intro_data.intro_para1, intro_data.intro_para2, intro_data.intro_para3, intro_data.intro_para4).all()
    session.close()

    all_cities = []
    for row in introduction:
        all_cities.append({"city_country": row[0],
                           "para1": row[1],
                           "para2": row[2],
                           "para3": row[3],
                           "para4": row[4]})

    # return jsonify(dict)
    return jsonify(all_cities)

@app.route("/test")
def TestRoute():
    ''' This function returns a simple message, just to guarantee that
        the Flask server is working. '''

    return "This is the test route!"
    session.close()





if __name__ == '__main__':
    app.run(debug=True)
