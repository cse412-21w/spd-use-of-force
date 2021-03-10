# imports
library(rgdal)
library(dplyr)
library(dummies)
library(tidyverse)
library(RSocrata)
library(broom)
library(geojsonio)
setwd("~/GitHub/spd-use-of-force")

# loading in the data
beats <- readOGR('static/beats/SPD_BEATS_WGS84.shp')
census <- readOGR('static/census/A_Tract_Profile_ACS_5-year_2009-2013.shp')
uof <- as.data.frame(read.socrata('https://data.seattle.gov/resource/ppi5-g2bj.csv'))
pumas <- readOGR('static/pumas/cb_2018_53_puma10_500k.shp')

# cleaning the uof data
uof$occured_date_time <- as.Date(substr(uof$occured_date_time, 1, 10), format =
                                   '%Y-%m-%d')
colnames(uof)[4] <- 'Date'
levels(uof$subject_race) <- c('Nat_Am', 'Asian', 'Black', 'Hisp_Lat', 'Pac_Isl',
                              'Race_NA', 'White')
uof$subject_race <- as.factor(uof$subject_race)
uof$incident_type <- as.factor(uof$incident_type)
levels(uof$incident_type) <- c('1', '2', '3', '4')

uof <- dummy.data.frame(data=uof, names=c('subject_race', 'subject_gender',
                                          'incident_type'), sep='_')

uof$count <- 1
colnames(uof)[3:6] <- c('Type_1','Type_2','Type_3','Type_4')
colnames(uof)[13:22] <- c('Nat_Am', 'Asian', 'Black', 'Hisp_Lat', 'Pac_Isl',
                          'Race_NA', 'White', 'F', 'M', 'Gender_NA')

# cleaning the beats data
beats <- spTransform(beats, proj4string(census))
beats_df <- tidy(beats, id = 'objectid')
colnames(beats@data)[1] <- 'id'
beats_df <- left_join(beats_df, beats@data, by='id')
beats_df <- beats_df[1:8]

by_beat <- aggregate(cbind(Type_1, Type_2, Type_3, Type_4, Nat_Am, Asian, Black,
                           Hisp_Lat, Pac_Isl, Race_NA, White, F, M, Gender_NA,
                           count) ~ beat, data=uof, sum)
colnames(beats_df)[8] <- 'beat'
beats_df <- left_join(beats_df, by_beat, by='beat')

# cleaning the census data
census <- cbind(census[1:3], census[6:8], census[10], census[12], census[14],
                census[16], census[18], census[20], census[22], census[45:46],
                census[48], census[50], census[54], census[56], census[78])
colnames(census@data) <- c('ID', 'GEOID', 'Tract_Name', 'Total_Pop', 'Median_Age',
                           'White', 'Black', 'NatAm', 'Asian', 'PacIsl',
                           'OtherRace', 'TwoPlusRace', 'HispLat', 'Pct_HSGrad',
                           'Pct_BachGrad', 'EngNotVWell', 'MedianHHIncome',
                           'Pop200PctBelowPov', 'PersonOfColor', 'Median_Gross_Rent')
census@data$Tract_Name <- substring(census@data$Tract_Name, 14,)

census_df <- census@data

# cleaning the PUMAs data
pumas_df <- tidy(pumas, id = 'PUMACE10')
pumas@data <- pumas@data %>% mutate(id = row(pumas@data)[,1]-1)
pumas$id <- as.character(pumas$id)
pumas_df <- left_join(pumas_df, pumas@data, by='id')
pumas_df <- cbind(pumas_df[1:7], pumas_df$NAME10)
colnames(pumas_df)[8] <- 'name'
pumas_df <- pumas_df %>% filter(str_detect(name, 'Seattle'))

# keying both datasets by PUMA
NW_beats <- c('N1', 'N2', 'N3', 'J1', 'J2', 'J3', 'B1', 'B2', 'B3')
NE_beats <- c('L1', 'L2', 'L3', 'U1', 'U2', 'U3', 'H2')
Downtown_beats <- c('Q1', 'Q2', 'Q3', 'D1', 'D2', 'D3', 'M1', 'M2', 'M3', 'K1',
                    'E1', 'E3', 'K3')
SE_beats <- c('E2', 'G1', 'G2', 'G3', 'C1', 'C2', 'C3', 'R2', 'R3', 'H3', 'S2', 'S3')
W_beats <- c('K2', 'O1', 'O2', 'O3', 'R1', 'S1', 'W1', 'W2', 'W3', 'F1', 'F2', 'F3')

NW_tracts <- c('3', '4.01', '4.02', '5', '6', '13', '14', '15', '16', '17.01',
               '17.02', '18', '27', '28', '29', '30', '31', '32', '33', '34',
               '35', '36', '46', '47', '48', '49', '50', '51', '54')
NE_tracts <- c('1', '2', '7', '8', '9', '10', '11', '12', '19', '20', '21', '22',
               '24', '25', '26', '38', '39', '40', '41', '42', '43.01', '43.02',
               '44', '45', '52', '53.01', '53.02')
Downtown_tracts <- c('56', '57', '58.01', '58.02', '59', '60', '61', '66', '68',
                     '69', '70', '71', '72', '73', '74.01', '74.02', '80.01',
                     '80.02', '81', '82', '83', '84', '85', '91', '92')
SE_tracts <- c('62', '63', '64', '65', '75', '76', '77', '78', '86', '87', '88',
               '89', '90', '95', '101', '102', '103', '111.01', '111.02', '118',
               '119')
W_tracts <- c('93', '94', '96', '97.01', '97.02', '98', '99', '100.01', '100.02',
              '104.01', '104.02', '105', '106', '107.01', '107.02', '108', '109',
              '110.01', '110.02', '112', '113', '114.01', '114.02', '115', '116',
              '117', '120', '121')

match_beat_PUMA <- function(s) {
  if (s %in% NW_beats) {
    return('NW')
  } else if (s %in% NE_beats) {
    return('NE')
  } else if (s %in% Downtown_beats) {
    return('Downtown')
  } else if (s %in% SE_beats) {
    return('SE')
  } else if (s %in% W_beats) {
    return('W')
  } else {
    return('')
  }
}

match_tract_PUMA <- function(s) {
  if (s %in% NW_tracts) {
    return('NW')
  } else if (s %in% NE_tracts) {
    return('NE')
  } else if (s %in% Downtown_tracts) {
    return('Downtown')
  } else if (s %in% SE_tracts) {
    return('SE')
  } else if (s %in% W_tracts) {
    return('W')
  } else {
    return('')
  }
}

by_beat$PUMA <- sapply(by_beat$beat, match_beat_PUMA)
beats@data$PUMA <- sapply(beats@data$beat, match_beat_PUMA)
census_df$PUMA <- sapply(census_df$Tract_Name, match_tract_PUMA)

# creating the final dataset
census_df <- census_df %>% filter(!(PUMA == ''))
by_puma <- aggregate(cbind(Total_Pop, White, Black, NatAm, Asian, PacIsl,
                           OtherRace, TwoPlusRace, HispLat, EngNotVWell, 
                           Pop200PctBelowPov, PersonOfColor) ~ PUMA,
                     data = census_df, sum)
by_puma <- left_join(by_puma, aggregate(cbind(Pct_HSGrad, Pct_BachGrad, Median_Age, MedianHHIncome,
                                              Median_Gross_Rent) ~ PUMA,
                                        data = census_df, median))

by_beat <- left_join(by_beat, by_puma, by='PUMA')
colnames(by_beat) <- c('Beat', 'Type_1', 'Type_2', 'Type_3', 'Type_4', 'NatAm_uof',
                       'Asian_uof', 'Black_uof', 'HispLat_uof', 'PacIsl_uof',
                       'RaceNA_uof', 'White_uof', 'F_uof', 'M_uof', 'GenderNA_uof',
                       'Count_uof', 'PUMA', 'Total_Pop', 'White_pop', 'Black_pop',
                       'NatAm_pop', 'Asian_pop', 'PacIsl_pop', 'OtherRace_pop',
                       'TwoPlusRace_pop', 'HispLat_pop', 'Pct_HSGrad', 'Pct_BachGrad',
                       'EngNotVWell', 'Pop200PctBelowPov', 'PersonOfColor',
                       'Median_Age', 'Median_HHIncome', 'Median_GrossIncome')
by_puma <- left_join(by_puma, aggregate(cbind(Type_1, Type_2, Type_3, Type_4,
                                              NatAm_uof, Asian_uof, Black_uof,
                                              HispLat_uof, PacIsl_uof, RaceNA_uof,
                                              White_uof, F_uof, M_uof, GenderNA_uof,
                                              Count_uof) ~ PUMA, data = by_beat,
                                        sum), by='PUMA')
by_date <- aggregate(cbind(Type_1, Type_2, Type_3, Type_4, Nat_Am, Asian,
                           Black, Hisp_Lat, Pac_Isl, Race_NA, White, count) ~ Date,
                     data = uof, sum)

write.csv(by_beat, 'static/by_beat.csv', row.names=FALSE)
write.csv(by_puma, 'static/by_puma.csv', row.names=FALSE)
write.csv(by_date, 'static/by_date.csv', row.names=FALSE)
geojson_write(input = beats, file='static/beats_geo.geojson')

geo2topo('static/beats_geo.geojson', object_name = 'beats_topo')

##Nicole making mini data set
#creating total sum
total_uof_count <- as.numeric(sum(by_beat$Type_1) + sum(by_beat$Type_2) + 
                              sum(by_beat$Type_3) + sum(by_beat$Type_4))
total_population <- as.numeric(sum(by_puma$Total_Pop))

#creating columns
race <- c("White", "Black/African American","Hispanic / Latino", "Asian", 
          "Pacific Islander", "Native American", "Not Specified")
uof_count <- c(sum(by_beat$White_uof), sum(by_beat$Black_uof), sum(by_beat$HispLat_uof), 
               sum(by_beat$Asian_uof), sum(by_beat$PacIsl_uof), sum(by_beat$NatAm_uof),
               sum(by_beat$RaceNA_uof))
uof_percent <- uof_count / total_uof_count
pop_count <- c(sum(by_puma$White), sum(by_puma$Black), sum(by_puma$HispLat), 
               sum(by_puma$Asian), sum(by_puma$PacIsl), sum(by_puma$NatAm), 0)
pop_percent <- pop_count / total_population

total_entries <- as.numeric(length(by_date$Date))
uof_pre_gf_count <- c(sum(by_date$White[1:2094]), sum(by_date$Black[1:2094]), sum(by_date$Hisp_Lat[1:2094]), 
                sum(by_date$Asian[1:2094]), sum(by_date$Pac_Isl[1:2094]), sum(by_date$Nat_Am[1:2094]), 
                sum(by_date$Race_NA[1:2094]))
uof_post_gf_count <- c(sum(by_date$White[2095:total_entries]), sum(by_date$Black[2095:total_entries]), sum(by_date$Hisp_Lat[2095:total_entries]), 
                 sum(by_date$Asian[2095:total_entries]), sum(by_date$Pac_Isl[2095:total_entries]), sum(by_date$Nat_Am[2095:total_entries]), 
                 sum(by_date$Race_NA[2095:total_entries]))
uof_post_summer_count <- c(sum(by_date$White[2167:total_entries]), sum(by_date$Black[2167:total_entries]), sum(by_date$Hisp_Lat[2167:total_entries]), 
                     sum(by_date$Asian[2167:total_entries]), sum(by_date$Pac_Isl[2167:total_entries]), sum(by_date$Nat_Am[2167:total_entries]), 
                     sum(by_date$Race_NA[2167:total_entries]))
uof_pre_gf <- uof_pre_gf_count / sum(uof_pre_gf_count)
uof_post_gf <- uof_post_gf_count / sum(uof_post_gf_count)
uof_post_summer <- uof_post_summer_count / sum(uof_post_summer_count)

#combine columns into dataframe
by_race <- data.frame(race = race, uof_percent = uof_percent * 100, pop_percent = pop_percent * 100,
                     difference = uof_percent * 100 - pop_percent * 100, pre_gf = uof_pre_gf * 100,
                     post_gf = uof_post_gf * 100, post_summer = uof_post_summer * 100)


#transpose the data so each row is uof/pop percent and each column is race
#hoping this will make animation easier

by_percent <- data.frame(White = double(3), Black = double(3), 
                          HispLat = double(3), Asian = double(3), PacIsl = double(3), 
                         NatAm= double(3), RaceNA = double(3))


for(i in 1:7) {
  by_percent[, i] <- c(uof_count[i]/total_uof_count * 100, pop_count[i] / total_population * 100, 
                       uof_count[i]/total_uof_count * 100 - pop_count[i] / total_population * 100)
}
rownames(by_percent)<- c("uof_count", "pop_count", "difference")


#exporting to csv
write.csv(by_race, 'static/by_race.csv', row.names=FALSE)
write.csv(by_percent, 'static/by_percent.csv')
