/**
 * Created by Lilik on 17.12.2015.
 */
$(document).ready(function(){
    var filterHead = $('.filter-heading-wrapper');
    var subFilter = $('.sub-filter-wrapper');
    var showMoreLink = $('.showmore-link-wrapper');
    var showMoreProducts = $('.showmore-thumbs-row');
    var plusIcon = $('.filter-plus-icon');
    var checkBox = $('.checkbox-inline');
    var submitButtonSelector = 'a[data-submit-button="true"]';

    window.filterStatus = window.filterStatus || {
      'favourites': 'hide',
      'history-search': 'hide',
      'your-categories': 'show',
      'international-brands': 'hide',
      'local-brands': 'hide' };
    var filterStatus = window.filterStatus;

    $(document).on("page:change", function() {
      window.prevPageYOffset = window.pageYOffset;
      window.prevPageXOffset = window.pageXOffset;
    });
    $(document).on("page:load", function() {
      if( window.turbolinksScroll === false ){
        window.scrollTo( window.prevPageXOffset, window.prevPageYOffset );
      }
      window.turbolinksScroll = undefined;
    });

    $(document).on('click', 'a', function(event) {
      var scroll = $(this).data('turbolinks-scroll');
      if( scroll === false ){
        window.prevPageYOffset = window.pageYOffset;
        window.prevPageXOffset = window.pageXOffset;
      }
      window.turbolinksScroll = scroll;
    });


    var displaySearchResultsMore = function() {
      var hasMore = $('.search-results-have-more:last-child').data('hasmore');
      if( hasMore ) {
        showMoreProducts.show();
      }
      else {
        showMoreProducts.hide();
      }
    }

    displaySearchResultsMore();

    showMoreProducts.on('ajax:success', function( e, data, status, xhr ) {
      $('.search-results-container').append(data);
      displaySearchResultsMore();
      var prodLength = $('.search-results-container .thumb-wrapper').length;

      showMoreProducts.find('a').each(function(idx, el){
        this.href = this.href.replace(/start_row_index=(\d+)/, 'start_row_index='+prodLength);
      });
    });

    $('.applied-filters-wrapper').on('click','.applied-filter', function(){
        $(this).hide();
    });

    // 'Buying guides' show block
    $('#buying-guides').click(function(){
        var leftPos = $(this).offset().left;
        var topPos = $(this).offset().top + 35;
        $('.buying-guides-block-wrapper').toggle(300).css({
            'left': leftPos,
            'top': topPos
        });
    });

    // 'Compare' show block
    $('#compare-button').click(function(){
        var leftPos = $(this).offset().left;
        var topPos = $(this).offset().top + 35;
        $('.compare-block-wrapper').toggle(300).css({
            'left': leftPos,
            'top': topPos
        });
    });

    // 'Categories' show block
    $('#categories-button').click(function(){
        var leftPos = $(this).offset().left;
        var topPos = $(this).offset().top + 30;
        $('.categories-block-wrapper').toggle(300).css({
            'left': leftPos,
            'top': topPos
        });
    });

    // Show 'burger' menu on mobile screen
    $('.mobile-burger-menu').click(function(){
       $('.main-menu-wrapper').slideToggle(200);
    });

    // Show 'filter' menu on mobile screen
    $('.mobile-filter-button').click(function(){
       $('.side-panel-wrapper').toggleClass('mobile-visible');
    });

        $('.mobile-filter-button').click(function(){
       $('.panel-wrapper').toggleClass('mobile-visible');
    });

    // Removing 'plus' icons if there are no sub-filters
    $(subFilter).each(function(){
       if($(this).find('.sub-filter-checkbox').length == 0){
           $(this).siblings('.filter-plus-icon').hide();
       }
    });

    // Adding a custom scrollbar for filtering
    var container = $('.filter-group-contents');
    $(container).perfectScrollbar({
        wheelSpeed: .1,
        wheelPropagation: true,
        minScrollbarLength: 20,
        scrollYMarginOffset: 150,
        maxScrollbarLength: 80
    });

    // Showing 'Your categories' filters by default

    for ( var filter in filterStatus ) {
      if( filterStatus[filter] === 'show' ) {
        var section = $('.filter-group.' + filter);
        section.children('.filter-group-contents').toggle().addClass('visible');
        $('.filter-group.' + filter + ' .filter-group-arrow').addClass('rotated');
        if(section.find('.filter-wrapper').length > 5){
          section.find('.showmore-link-wrapper:first').show();
        }
      }
    }


    // Hiding more than 5 filters
    if($(filterHead).siblings('.filter-group-contents').find('.filter-wrapper').length > 5){
        $(filterHead).siblings('.filter-group-contents').find('.filter-wrapper:gt(4)').hide();
    }

     // Toggling main filters
    $(filterHead).click(function(){
        $(this).siblings('.filter-group-contents').toggle(300).toggleClass('visible');
        $(this).children('.filter-group-arrow').toggleClass('rotated');
        var filterType = $(this).parents('.filter-group').data('type');

        if($(this).children('.filter-group-arrow').hasClass('rotated')){
          filterStatus[filterType] = 'show';
          if($(this).siblings('.filter-group-contents').find('.filter-wrapper').length > 5){
            $(this).nextAll('.showmore-link-wrapper:first').show(300);
          }
        }
        else {
          filterStatus[filterType] = 'hide';
          $(this).nextAll('.showmore-link-wrapper:first').hide(300);
        }

    });

    // Adding filter boxes to grey bar
    function applyFilter(filterText, filterCheckBoxId, isChecked){

        var filterHtml = "<div data-filterId="+filterCheckBoxId+" class='applied-filter'>" +
            "<span class='glyphicon glyphicon-remove'></span>" +
            "<span class='applied-filter-text'>"+filterText+"</span>";

        if(isChecked)
            $('.applied-filters-wrapper').append(filterHtml);

        var appliedFilters = $('.applied-filter');
        if(!isChecked){
            $(appliedFilters).each(function(){

                if($(this).attr('data-filterId') == filterCheckBoxId)
                    $(this).remove();
            });
            return 0;
        }
    }


    //  Showing/hiding filters sub-groups
    $(plusIcon).click(function(){
        if($(this).siblings('.sub-filter-wrapper').length > 0){
            $(this).siblings('.sub-filter-wrapper:first').toggle(300);
            $(this).toggleClass('glyphicon-minus');
        }
        if($(this).siblings('.checkbox-style:first').children('input').prop('checked') == true){
            var appliedFilter = $('.applied-filter');
            $(this).siblings('.checkbox-style:first').children('input').prop('checked', false);
        }
        else if($(this).siblings('.checkbox-style:first').children('input').prop('checked') == false) {
            $(this).siblings('.checkbox-style:first').children('input').prop('checked', true);
        }

    });

    $(checkBox).click(function(){
        if($(this).parent().siblings('.sub-filter-wrapper').length > 0){
            $(this).parent().siblings('.sub-filter-wrapper:first').toggle(300);
            $(this).parent().siblings('.filter-plus-icon').toggleClass('glyphicon-minus');
        }
    });

    // Behaviour of 'Show more' button
    $(showMoreLink).click(function(event){
        if($(this).children('.more-link').text() == 'More...'){
            $(this).siblings('.filter-group-contents').children('.filter-wrapper:gt(4)').show(400);
            $(this).siblings('.filter-group-contents').children('.ps-scrollbar-y-rail:first').css('display', 'block');
            $(this).children('.more-link').text('Less...');
        }
        else{
            $(this).siblings('.filter-group-contents').children('.filter-wrapper:gt(4)').hide(400)
            $(this).siblings('.filter-group-contents').children('.ps-scrollbar-y-rail:first').css('display', 'none');
            $(this).children('.more-link').text('More...');

        }
    });

    // Submit form with javascript
    $(document).on( "click", submitButtonSelector, function(event) {
      event.preventDefault();
      var targetButtonSelector = $(this).data('submit-target');
      if (targetButtonSelector && $(targetButtonSelector)) {
        $(targetButtonSelector).click();
      }
    });

    // Creates select stars widget for reviews
    document.linkRating = function(options){
      var widget = document.querySelector(options.widget);
      var field = $(options.field);

      var currentRating = field.val();

      var maxRating= 5;

      var callback = function(rating) { field.val(rating); };

      var myRating = rating(widget, currentRating, maxRating, callback);
    }

});
