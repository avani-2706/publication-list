(function ($, Drupal) {
  Drupal.behaviors.customModule = {
    attach: function (context, settings) {
    
    // Added nice select 
    jQuery('select').niceSelect();

    // Pager
    jQuery('.pager__items li.pager__item--next').detach().insertBefore('.next-pager span');

    jQuery('.pager__items li.pager__item--previous').detach().   insertBefore('.prev-pager span');

    jQuery('.pager__items li.pager__item--first').remove();
    jQuery('.pager__items li.pager__item--last').remove();
    
    
    jQuery('.active-pager span').click(function(){
      jQuery('.active-pager').toggleClass('open');
    });

    var activePager = jQuery('.pager__items li.is-active a').text();
    activePager = activePager.replace("Current page", "");    
    jQuery('.active-pager .page-number').empty().append(activePager);


    },
  };
})(jQuery, Drupal);