import { renderText } from '../src';

const mask0 = `####### #     #######
#     # ###   #     #
# ### # ####  # ### #
# ### #  ###  # ### #
# ### # ### # # ### #
#     # ###   #     #
####### # # # #######
        ##  #        
  #   #####  #### ###
####   ###  ##### ## 
 #  # # #   # ##### #
####   ##    ####    
# # ####  # #  #  # #
        #    ####    
####### ## ## # ## ##
#     #      #####  #
# ### #   # #  #  ## 
# ### #   #          
# ### # # #  ##  ##  
#     #  ### ## ## ##
#######  ##  ## # # #`;

const mask1 = `####### #     #######
#     # #  ## #     #
# ### # ####  # ### #
# ### #     # # ### #
# ### #  ## # # ### #
#     # #  ## #     #
####### # # # #######
          ##         
##  #######  # #  ###
    ##    ##     #  #
 #  # # #   # ##### #
    ##   ####    ####
# # ####  # #  #  # #
        #####    ####
####### ## ## # ## ##
#     # #####     ## 
# ### # # # #  #  ## 
# ### #  # ##########
# ### #   #  ##  ##  
#     # #   #  #  #  
####### ###  ## # # #`;

const mask2 = `####### ## #  #######
#     # # ##  #     #
# ### # ## ## # ### #
# ### # ## ## # ### #
# ### # ##    # ### #
#     #   ##  #     #
####### # # # #######
        #  ##        
 # # ## ##  ### #####
 # ##  # ##  # #   ##
###   #   #    # #   
# #  #  ## #  # ## # 
##### #  #####   ####
        ## #  # ## # 
#######  ###     ### 
#     # # # ## # ##  
# ### #       ###  ##
# ### # #### # # # # 
# ### #  ###  ##  ## 
#     # # #   ###   #
#######  #  ##       `;

const mask3 = `####### ###   #######
#     # # #   #     #
# ### # ##### # ### #
# ### # ### # # ### #
# ### #  # #  # ### #
#     #    #  #     #
####### # # # #######
            #        
# ### # ### ##   ####
  ## #  ## #  ####   
##   ## # ##  ##    #
### ## ##### ##  #   
#  # #####  # # # #  
        ##      #  ##
#######  # # #  ###  
#     #    ## ### ###
# ### # #  #   ### # 
# ### # ## #   ###   
# ### # ##   # #### #
#     #   ##   ###   
####### ### #   #  # `;

const mask4 = `####### ###   #######
#     # ##### #     #
# ### #    #  # ### #
# ### #    #  # ### #
# ### # ####  # ### #
#     # #     #     #
####### # # # #######
         # #         
#### ##      # ##  ##
#  # # ## # #  ### # 
## #  ##   #  #  ### 
#  # # ####    ####  
##  # ## #  #### #  #
           ####    ##
#######   ####  # ###
#     # ###    ## # #
# ### #   ##    # # #
# ### # ##   ##  ##  
# ### # ##           
#     # ### #### #   
####### #       ##  #`;

const mask5 = `####### ## #  #######
#     # # ### #     #
# ### #    #  # ### #
# ### #     # # ### #
# ### #     # # ### #
#     # # ### #     #
####### # # # #######
        #  #         
   ## #      ###   ##
    ##    ##     #  #
 ###  #  ## #    ##  
  #  #  ## ## # #### 
##### #  #####   ####
         # ## # #### 
#######   ###  # # # 
#     #  ####     ## 
# ### # ##  # # # ###
# ### # ###### # ### 
# ### #  ###  ##  ## 
#     #   # # ### # #
#######      # #  #  `;

const mask6 = `####### ## #  #######
#     # # ### #     #
# ### #   ##  # ### #
# ### # #   # # ### #
# ### # #  ## # ### #
#     #     # #     #
####### # # # #######
           #         
#     ##  #  #  ## ##
    ##    ##     #  #
 # # ## ##### #   # #
  # #   ### # #   ## 
##### #  #####   ####
         # ###  ### #
####### #  ### ###   
#     #  ####     ## 
# ### #  # ##   #### 
# ### #  #  ## ## ## 
# ### #  ###  ##  ## 
#     #   # ## ## ## 
####### # #    ## ## `;

const mask7 = `####### #     #######
#     # ##    #     #
# ### #  ##   # ### #
# ### # ####  # ### #
# ### #  #  # # ### #
#     #  ###  #     #
####### # # # #######
        ### #        
 ## #### ### ##  # ##
####   ###  ##### ## 
      ### # #### ####
## # # #   # # ###  #
# # ####  # #  #  # #
          #   ##   # 
####### ##  #   #  # 
#     # #    #####  #
# ### # #   ## ## #  
# ### #   ##  #  #  #
# ### # # #  ##  ##  
#     # ## #  #  #  #
#######  ### #  ###  `;

test("0th mask works", () => expect(renderText({ value: "hello", maskType: 0 })).toBe(mask0));
test("1st mask works", () => expect(renderText({ value: "hello", maskType: 1 })).toBe(mask1));
test("2nd mask works", () => expect(renderText({ value: "hello", maskType: 2 })).toBe(mask2));
test("3rd mask works", () => expect(renderText({ value: "hello", maskType: 3 })).toBe(mask3));
test("4th mask works", () => expect(renderText({ value: "hello", maskType: 4 })).toBe(mask4));
test("5th mask works", () => expect(renderText({ value: "hello", maskType: 5 })).toBe(mask5));
test("6th mask works", () => expect(renderText({ value: "hello", maskType: 6 })).toBe(mask6));
test("7st mask works", () => expect(renderText({ value: "hello", maskType: 7 })).toBe(mask7));