library(sjstats)  # For anova_stats() function
library(tidyverse)

# Set contrasts and working directory
options(contrasts=c("contr.sum","contr.poly"))
setwd("~/git/BidirectionalInteractions/data")

# Load processed scores
data <- read.csv("scores.csv", fileEncoding="UTF-8-BOM")

# Filter excluded subjects
excluded <- read_lines("excluded.txt")
data <- filter(data, !(subject %in% excluded))

# Convert independent variables to factors
data$subject <- factor(data$subject, ordered=F)
data$octave <- factor(data$octave, ordered=F)

# Sort data by task type for one-way ANOVAs (0 = pitched context, 1 = pitched probe)
pc_data <- filter(data, task_type == 0)
pp_data <- filter(data, task_type == 1)

###
# PITCHED PROBE
###

# Repeated measures ANOVA (d')
model <- aov(dprime ~ 1 + octave * ioi + Error(subject / (octave * ioi)), data=pp_data)
anova_stats(model)

# Repeated measures ANOVA (C)
model <- aov(C ~ 1 + octave * ioi + Error(subject / (octave * ioi)), data=pp_data)
anova_stats(model)

# Pairwise t-tests for main effect of octave
pairwise.t.test(pp_data$C, pp_data$octave, p.adj="bonferroni", paired=T, alternative="two.sided")
# Octave 7 probe perceived as earlier than octave 3 probe

###
# PITCHED CONTEXT
###

# Repeated measures ANOVA (d')
model <- aov(dprime ~ 1 + octave * ioi + Error(subject / (octave * ioi)), data=pc_data)
anova_stats(model)

# Repeated measures ANOVA (C)
model <- aov(C ~ 1 + octave * ioi + Error(subject / (octave * ioi)), data=pc_data)
anova_stats(model)

# Pairwise t-tests for main effect of octave
pairwise.t.test(pc_data$C, pc_data$octave, p.adj="bonferroni", paired=T, alternative="two.sided")
# Tick following octave 7 perceived as later than tick following octave 5
