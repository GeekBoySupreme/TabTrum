//Comparer Function    
function GetSortOrder(prop) {    
  return function(a, b) {    
      if (a[prop] > b[prop]) {    
          return 1;    
      } else if (a[prop] < b[prop]) {    
          return -1;    
      }    
      return 0;    
  }    
} 


document.addEventListener('click', function (event) {

  if(event.target.id == 'snapshot_button')return;

  var snapshot_index = event.target.id.split('_')[3];
  var action = event.target.id.split('_')[1];

  if(action == 'delete')
    clickDelete(snapshot_index);
  else if(action == 'launch')
    clickLaunch(snapshot_index);
  else
    return;

}, false);



  var button = document.getElementById('snapshot_button');
  button.onclick = function() {
     
    try {
        chrome.storage.local.get(['data'], function(items) {
        var tab_data = items.data;
        
        if(tab_data) {
          chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
            var new_snapshot = {
              'title' : 'Snapshot ' + tab_data.length,
              'id' : 'id_' + tab_data.length,
              'tablist' : tabs
            }
  
            tab_data.push(new_snapshot);
            setData(tab_data); 
            update_panel(new_snapshot);
          });
        }
        else {
          var init_data = [];
          chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
            var new_snapshot = {
              'title' : 'Snapshot ' + init_data.length,
              'id' : 'id_' + init_data.length,
              'tablist' : tabs
            }

            init_data.push(new_snapshot);
            setData(init_data); 
            update_panel(new_snapshot);
          });
        }
      });
    }
    catch(e) {
      var init_data = [];
      chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
        var new_snapshot = {
          'title' : 'Snapshot ' + init_data.length,
          'id' : 'id_' + init_data.length,
          'tablist' : tabs
        }

        init_data.push(new_snapshot);
        setData(init_data); 
        update_panel(new_snapshot);
      });
    } 
  };




  function loadData() {
    var render_home = '';

    try {
      chrome.storage.local.get(['data'], function(items) {
        var render_data = items.data;

        if(render_data.length > 0) {
          render_home = '';
        }

        if(render_data) {
          for(var i = render_data.length-1; i >= 0; i--) {
            render_home += '<div class="snapshot_tab snapshot_tab_style_'+ render_data[i].id +'" id="snapshot_tab_'+ render_data[i].id +'"> \
                            <h5 class="snapshot_title"><span class="snapshot_marker snapshot_marker_'+ render_data[i].id +'"></span>'+ render_data[i].title +'</h5> \
                            <button class="snapshot_delete" id="snapshot_delete_'+render_data[i].id +'">x</button> \
                            <button class="snapshot_launch" id="snapshot_launch_'+ render_data[i].id +'">Launch Tabs</button> \
                            </div>';
          }

          if(render_data.length == 0) {
            render_home = '<img id="image_holder" class="img-fluid" src="./images/miroodle.png"/> \
            <span class="placeholder_text">Hey there,<br/> You have not snapped Tabs yet!</span>';

            document.getElementById('snapshot_list').innerHTML = render_home;
          }
          else {
            document.getElementById('snapshot_list').innerHTML = render_home;
          }

          
        }
        else {
          var data_initialize = [];
          setData(data_initialize);
        }
        
      });
    }
    catch(e) {
      console.log("Error : "+e);

      var data_initialize = [];
      setData(data_initialize);
    } 
  }


  function setData(data_update) {

    console.log(data_update);
    chrome.storage.local.set({'data' : data_update}, function() {
      console.log('Settings saved');
    });
  }

  


  function update_panel(data_snapshot) {
      var render_update = '';
      render_update = '<div class="snapshot_tab" id="snapshot_tab_'+ data_snapshot.id +'"> \
                       <h5 class="snapshot_title">'+ data_snapshot.title +'</h5> \
                       <button class="snapshot_delete" id="snapshot_delete_'+ data_snapshot.id +'">x</button> \
                       <button class="snapshot_launch" id="snapshot_launch_'+ data_snapshot.id +'">Launch Tabs</button> \
                       </div>';
      
      chrome.storage.local.get(['data'], function(items) {
        var render_data = items.data;
        if(render_data.length > 1)
          document.getElementById('snapshot_list').innerHTML += render_update;
        else
          document.getElementById('snapshot_list').innerHTML = render_update;
      });

  }



function clickLaunch(snapshot_index) {
  var index = snapshot_index;
  
    try {
      chrome.storage.local.get(['data'], function(items) {
        document.write(items.data[index]);
        tabs_to_launch = items.data[index].tablist;
  
        for(var i=0; i < tabs_to_launch.length; i++) {
          var launch_url = tabs_to_launch[i].url;
          chrome.tabs.create({ url: launch_url });
        }
    
      });
    }
    catch(e) {
      chrome.storage.local.get(['data'], function(items) {
        tabs_to_launch = items.data[index].tablist;
        console.log(items.data[index].tablist)
  
        for(var i=0; i < tabs_to_launch.length; i++) {
          var launch_url = tabs_to_launch[i].url;
          chrome.tabs.create({ url: launch_url });
        }
    
      });
    }    
}

function clickDelete(snapshot_delete) {
  chrome.storage.local.get(['data'], function(items) {
    var index = snapshot_delete;

    if(items.data[index].id = index)
      items.data.splice(index,1)
    
    for(var i=0; i < items.data.length; i++)
      items.data[i].id = "id_" + i;
    
    setData(items.data);
    loadData();
  });
}


loadData();



 
