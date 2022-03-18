import { renderText } from '../src/renderer/renderText';

const exampleCom = `####### ### ##### #######
#     # #  ## #   #     #
# ### #    ### ## # ### #
# ### # # #   ##  # ### #
# ### # ## #   ## # ### #
#     #   # # #   #     #
####### # # # # # #######
         #  #  ##        
#     ## #  #    #  ## ##
 #  #   ## ##      ## ## 
 ##  #### ##    ## # # ##
#   #  ## ### ## ##      
# ## ##  # ## #  # ## #  
  ###  ########  #  #   #
# # ###  #   #  ## ######
       # ## ###    ## ## 
 ########## ### ######  #
         ###   ##   ###  
####### #  ## ### # ##  #
#     #  ####  ##   #  # 
# ### #  ##  ## ##### ## 
# ### #  ###  ##      # #
# ### #  # #  ####    ## 
#     #  # # ## ## # ### 
####### # ### ##  # #####`;

test('woo', () => {
  expect(renderText({ value: 'https://example.com' })).toBe(exampleCom);
  expect(1 + 2).toBe(3);
});