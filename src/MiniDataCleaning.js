import newuof from '/Users/nicolegooding/Documents/GitHub/spd-use-of-force/static/by_beat.csv'
import pumadata from '‎⁨/Users/nicolegooding/Documents/GitHub/spd-use-of-force/static/by_puma.csv'

d3 = require("d3@6");

totalcounts = d3.sum(newuof, d => d.Type_1) + d3.sum(newuof, d => d.Type_2) + d3.sum(newuof, d => d.Type_3) + d3.sum(newuof, d => d.Type_4);
totalpop = d3.sum(pumadata, d => d.Total_Pop);