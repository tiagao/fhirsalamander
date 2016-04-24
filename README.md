FHIRSalamander

Presentation [http://tiny.cc/bayeshhs_fs](http://tiny.cc/bayeshhs_fs)


Hosted [http://tiny.cc/bayeshhs_fsdemo](http://tiny.cc/bayeshhs_fsdemo)


Conventional insurance search tools gives you a list of insurance plans for your demographic, location,  listed by premium and deductible prices. But that’s not so helpful. Instead, most people need a way to help them find an insurance plan when they 

(1) have specific doctor(s) in mind and they want to find an insurance that takes their doctor(s)

(2) have specific medical condition (e.g. skin issues, heart issues, allergies) they want to find an insurance that covers doctors for their condition (dermatologists, cardiologists, allergist) 

(3) have specific drug(s) in mind and they want to find an insurance that covers their drug(s)

<b> At this hackathon we accomplished:</b>

* Code: crawled all provider/plan data for the state of Virginia and created proof of concept for scenarios 1 and 2 above.  Visit <a href=" http://tiny.cc/bayeshhs_fsdemo "> http://tiny.cc/bayeshhs_fsdemo </a> for demo.

* Design: designed the user exeperience for a new health insurance search tool that solves for scenarios 1 to 3 above.  Visit <a href=" http://tiny.cc/bayeshhs_fs "> http://tiny.cc/bayeshhs_fs </a> to see the design.

<b> Design Walkthrough </b>

The inspiration for the design is from any conversation you’d have with someone who can advise you on which health insurance to choose.  The goal of this design is to create an experience that feels empathetic and simple.
We start with the first question, do you go to the doctor a lot. If you say no, we’ll show you a list of plans that are based on price. So you can easily pick the cheapest plan.
If you say yes, we ask you whether you have any specific doctors you’d want to see. 
If you say no, we’ll skip the next screen. If you say yes, we’ll ask you which doctors you’d prefer to see.
Then we ask if you have any pre-existing conditions.  
If you say no, or you don’t even know that I’m asking about (which means you don’t have any) then we skip the next screen. If you say yes, we’ll ask you to tell us which pre-existing conditions you have. 
Then we ask if you take any medications. 
If you say no, we skip the next screen. If you say yes, we’ll ask you which medications you’re taking.
Finally we show you the list of insurance plans that covers your needs (be it your doctors, your pre-existing conditions, or your medications). 
We show you the 3 most common numbers you’d care about: your premium, which is how much you have to pay per month. Your deductible, which is how much you have to pay before this insurance kicks in. Your copay for primary care, which is how much you pay when you go to see a primary care doctor, we show this because this is the type of doctor that people see most frequently.
If none of these 3 numbers make sense to you, you could just pick based on the dollar signs, we put the dollar signs to the right, where you would expect to see it like on Yelp.
We put the medal color on the top right corner, so people who cares about the gold/silver/bronze medals is about can see that.
You choose the plan. 
If earlier in the flow you had selected a particular doctor, and you unchecked the box for “I’m an existing patient” … this means you’re not yet an existing patient with this doctor. If that’s the case, we encourage you to call this doctor to confirm that they actually support the plan and also that they can take you as a new patient. You could also just skip this step.
You call the doctor and then we ask you if indeed the doctor is taking this insurance. If you say no, we take you back to the insurance selector so you can pick another insurance. If you say yes, you’re done and you’re ready to sign up for this health insurance. 

