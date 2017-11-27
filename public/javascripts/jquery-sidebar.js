/**
 * Create a new sidebar on this jQuery object.
 *
 * @example
 * var sidebar = $('#sidebar').sidebar();
 *
 * @param {Object} [options] - Optional options object
 * @param {string} [options.position=left] - Position of the sidebar: 'left' or 'right'
 * @returns {jQuery}
 */
var marker = L.marker();
$.fn.sidebar = function(options) {
    
    var $sidebar = this;
    var $tabs = $sidebar.find('ul.sidebar-tabs, .sidebar-tabs > ul');
    var $container = $sidebar.children('.sidebar-content').first();
    
    options = $.extend({
        position: 'left'
    }, options || {});

    $sidebar.addClass('sidebar-' + options.position);
    /*if (!$sidebar.hasClass('collapsed')) {
            
            $sidebar.addClass('collapsed');
    }*/
    $tabs.children('li').children('a[href^="#"]').on('click', function(e) {
        
        e.preventDefault();
        var $tab = $(this).closest('li');
        
        if ($tab.hasClass('active'))
            $sidebar.close();
        else if (!$tab.hasClass('disabled')){
            $sidebar.open(this.hash.slice(1), $tab);
            //console.log($tab.index());
            var curr_content = $('.sidebar-content').children()[$tab.index()-1];
            
            if($(curr_content).attr('id') == 'new-content'){
                var circleicon = L.icon({iconUrl: '/images/icons/blank.png', iconSize: [40,40], shadowUrl: '/images/icons/shadow.png', shadowSize: [40,30], shadowAnchor: [0,10]});
                marker = L.marker(map.getCenter(), {icon: circleicon, draggable: true});
                //console.log(marker._latlng);
                markersLayer.addLayer(marker);
            }
            else{
                var curr_lat = $($(curr_content).children()[5]).html();
                var curr_lng = $($(curr_content).children()[6]).html();

                map.setView([curr_lat, curr_lng], map.getZoom());
            }
            
        }
    });
    
    //OLD WAS $sidebar.find('.sidebar-close').on('click', fn)
    //$('.sidebar-close').unbind('click').bind('click', function(e){
    $('.sidebar').off('click').on('click', '.sidebar-close', function(){


        var $item=$('#content-description'), isEditable=$item.is('.editable');
        if(isEditable){
            $('.sidebar-edit > i').removeClass('fa-check');
            $('.sidebar-edit > i').addClass('fa-edit');
            $item.prop('contenteditable',!isEditable).toggleClass('editable');
            var $item2=$item.prev().prev().prev().prev(), isEditable2=$item2.is('.editable');
            $item2.prop('contenteditable',!isEditable2).toggleClass('editable');
            sliderChange();
        }


        $sidebar.close();
        markersLayer.removeLayer(marker);
    })
  
    
 
    //$sidebar.find('.sidebar-edit').unbind('click').bind('click', function(){
    //$('.sidebar-edit').on('click', function(){
    $('.sidebar')/*.off('click')*/.on('click', '.sidebar-edit', function(){
        if($('.sidebar-edit > i').hasClass('fa-edit')){ //TO EDIT
            //console.log("Editing now");
            $('.sidebar-edit > i').removeClass('fa-edit');
            $('.sidebar-edit > i').addClass('fa-check');

            var $item=$('.active > #content-description'), isEditable=$item.is('.editable');
            $item.prop('contenteditable',!isEditable).toggleClass('editable');


            var $item2=$item.prev().prev().prev().prev(), isEditable2=$item2.is('.editable');
            $item2.prop('contenteditable',!isEditable2).toggleClass('editable');

            

            //SEND GET REQUEST TO GET THE DETAILS
            var zoom = map.getZoom();
            
            if(zoom > 5){
                var type = 'spots';
            }
            else{
                var type = 'events';
            }
            
            if($item.prev().attr('src') == 'images/blank.jpg' && $item.prev().prev().prev().prev().html() == "Title" && $item.html() == "Enter your description here and pick a spot on the map to place marker"){
                var str1 = "<p>Image URL: <input value = 'images/blank.jpg'></input></p>";
                var str2 = "<p>Icon URL: <input value = ''></input></p>";
                var str3 = "<p>NEW ITEM</p>";
                $(str1).insertBefore($item.prev().prev().prev());
                $(str2).insertBefore($item.prev().prev().prev());
                $(str3).hide().insertAfter($item);

                
            }
            else{
                $.get('/read/'+type+'/'+$item2.html(), function(result){
                    var str1 = "<p>Image URL: <input value = '"+result.values.imgurl+"'></input></p>";
                    var str2 = "<p>Icon URL: <input value = '"+result.values.iconurl+"'></input></p>";
                    var str3 = "<p>"+result._id+"</p>";

                    $(str1).insertBefore($item.prev().prev().prev());
                    $(str2).insertBefore($item.prev().prev().prev());
                    $(str3).hide().insertAfter($item);

                });
            }
            
            
            

        }
        else{
            $('.sidebar-edit > i').removeClass('fa-check');
            $('.sidebar-edit > i').addClass('fa-edit');


            var zoom = map.getZoom();
            
            if(zoom > 5){
                var type = 'spots';
            }
            else{
                var type = 'events';
            }

            var $item=$('.active > #content-description'), isEditable=$item.is('.editable');
            $item.prop('contenteditable',!isEditable).toggleClass('editable');

            var iconurl = $item.prev().prev().prev().prev().children().val();
            var imgurl = $item.prev().prev().prev().prev().prev().children().val();

            var $item2=$item.prev().prev().prev().prev().prev().prev(), isEditable2=$item2.is('.editable');
            $item2.prop('contenteditable',!isEditable2).toggleClass('editable');

            $item.prev().prev().prev().prev().remove();
            $item.prev().prev().prev().prev().remove();


            var title = $item2.html();//$item.prev().prev().prev().html();

            //REMEMBER TO GET LAT LNG FROM MARKERS
            var lat = $item.next().next().html();
            var lng = $item.next().next().next().html();

            var doc = {desc: $item.html(), name: title, iconurl: iconurl, imgurl: imgurl, lat: lat, lng: lng};
            doc.path = '#'+(doc.name).replace(/\s+/g, '').replace(/\'+/g, '');
            doc.year = time;
            doc.hashid = doc.name.replace(/\s+/g, '').replace(/\'+/g, ''); 

            var current_id = $item.next().html();
                
            $item.next().remove();

            if(current_id == 'NEW ITEM'){
                if(iconurl == '' && imgurl == 'images/blank.jpg' && $item.prev().prev().prev().prev().html() == "Title" && $item.html() == "Enter your description here and pick a spot on the map to place marker"){
                    alert('Please make changes before adding a new point or cancel by clicking the button next to the submit button');
                }
                else{
                    doc.lat = marker._latlng.lat;
                    doc.lng = marker._latlng.lng;
                    if(doc.iconurl == ""){
                        doc.iconurl = '/images/icons/blank.png';
                    }

                    //console.log(doc);
                    $.post('/insert/'+type,  doc, function(result){
                        console.log(result);
                        sliderChange();
                    });
                }
                  
            }
            else{
                

                $.post('/modify/'+current_id, doc,  function(result){
                    console.log(result);
                    sliderChange();
                });
            }

            
            
            /*$sidebar.close();
            $sidebar.sidebar();*/
            

            
            
           
        }
    });

    /**
     * Open sidebar (if necessary) and show the specified tab.
     *
     * @param {string} id - The id of the tab to show (without the # character)
     * @param {jQuery} [$tab] - The jQuery object representing the tab node (used internally for efficiency)
     */
    $sidebar.open = function(id, $tab) {
        
        if (typeof $tab === 'undefined')
            $tab = $tabs.find('li > a[href="#' + id + '"]').parent();

        // hide old active contents
        $container.children('.sidebar-pane.active').removeClass('active');

        // show new content
        $container.children('#' + id).addClass('active');

        // remove old active highlights
        $tabs.children('li.active').removeClass('active');

        // set new highlight
        $tab.addClass('active');

        $sidebar.trigger('content', { 'id': id });
        
        if ($sidebar.hasClass('collapsed')) {
            
            // open sidebar
            $sidebar.trigger('opening');
            $sidebar.removeClass('collapsed');
            
        }

       
        var lat = $('#content-description').next().html();
        var lng = $('#content-description').next().next().html();

    };

    /**
     * Close the sidebar (if necessary).
     */
    $sidebar.close = function() {
        // remove old active highlights
        $tabs.children('li.active').removeClass('active');

        if (!$sidebar.hasClass('collapsed')) {
            // close sidebar
            $sidebar.trigger('closing');
            $sidebar.addClass('collapsed');
        }
    };

    $sidebar.refresh = function(){
        
        var $tabs = $sidebar.find('ul.sidebar-tabs, .sidebar-tabs > ul');
        var $container = $sidebar.children('.sidebar-content').first();
    
        options = $.extend({
            position: 'left'
        }, options || {});

        $sidebar.addClass('sidebar-' + options.position);
    /*if (!$sidebar.hasClass('collapsed')) {
            
            $sidebar.addClass('collapsed');
    }*/
        $tabs.children('li').children('a[href^="#"]').on('click', function(e) {
        
            e.preventDefault();
            var $tab = $(this).closest('li');
        
            if ($tab.hasClass('active'))
                $sidebar.close();
            else if (!$tab.hasClass('disabled'))
                $sidebar.open(this.hash.slice(1), $tab);
        });
    };
    return $sidebar;
};