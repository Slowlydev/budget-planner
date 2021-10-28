## Getting Started

Clone repo from git 
```bash
git clone [link]
cd project-planner
```

Install all packages

```bash
yarn
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## thoughts during development > expenses

### first execution

empty reactive array
button > new object in array
upload reactive array

### second execution

if does not data exisits > first executuon : continue

empty reactive array 
load db into data 
load data into reactive array 

upload reactive array

## thoughts during development > dates

### what do we have?
date now  
date when item got added  
duration until we can get it 

### what to do?
clac time 
get time of item added 
add time diff 
get new date 

mils of date added 
add duration in mils to <1> 
get date from <2> 
display when 
clac when how many days ( 
  get time now 
  get time when getable 
  return diff 
) 