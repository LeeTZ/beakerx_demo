/*
 *  Copyright 2017 TWO SIGMA OPEN SOURCE, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

define([
  'jquery-ui/ui/widgets/draggable',
  'jquery-ui/ui/widgets/droppable' 
],function(
  draggable, 
  droppable
){
  var inNotebook = !Jupyter.NotebookList;
  if (!inNotebook) {
    return;
  }

  var side_panel_start_width = 35;
  var redo_panel;
  var active_page = 1;
  var active_product = 0;
  var dragging = '';
  var query = '';
  var quandlIcon = 'https://d3rlqa3rnk4r1f.cloudfront.net/assets/images/logos/v2/quandl-word-mark-fb41d14c7a394be8118897fb977de828.svg';
  var enigmaIcon = 'https://assets.enigma.com/blocks/Meet-the-new-Public-3.svg?mtime=20170620130459';
  var datasets = [
    {
      'name': 'BraveNewCoin Daily Global Price Index for Bitcoin',
      'description': "Updated daily, this database contains Brave New Coin's Global Weighted Averages.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/15084/bnc_logo.png',
      'code': 'BNC3/GWA_BTC',
      'outlink': 'https://www.quandl.com/data/BNC3/GWA_BTC-BraveNewCoin-Daily-Global-Price-Index-for-Bitcoin',
      'frequency': 'Monthly',
      'refreshed': '2 months ago',
      'provider': 'Quandl'
    },
    {
      'name': 'Zillow Real Estate Research',
      'description': "The Zillow Home Value Index is Zillow's estimate of the median market value of zillow home value index - top tier within the city of Pomfret, NY. This data is calculated by Zillow Real Estate Research (www.zillow.com/research) using their database of 110 million homes.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/797/zillow.jpg',
      'code': 'ZILLOW/C4374_ZHVITT',
      'outlink' : 'https://www.quandl.com/data/ZILLOW/C4374_ZHVITT-Zillow-Home-Value-Index-City-Zillow-Home-Value-Index-Top-Tier-Pomfret-NY',
      'frequency': 'Monthly',
      'refreshed': '2 months ago',
      'provider': 'Quandl'
    },{
      'name': 'Tokyo Stock Exchange',
      'description': "End of day unadjusted prices and additional information for companies trading on the Tokyo Stock Exchange in Japan.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/473/tokyo-stock-exchange.png',
      'code': 'TSE/1494',
      'outlink' : 'https://www.quandl.com/data/TSE/1494-One-Etf-High-Dividend-Japan-Equity-1494',
      'frequency': 'Daily',
      'refreshed': '8 hours ago',
      'provider': 'Quandl'
    },{
      'name': 'NASDAQ OMX Global Index Data',
      'description': "Over 35,000 global indexes published by NASDAQ OMX including Global Equity, Fixed Income, Dividend, Green, Nordic, Sharia and more. Daily data.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/10471/thumb_thumb_nasdaqomx_fao.jpg',
      'code': 'NASDAQOMX/LDRIG05',
      'outlink' : 'https://www.quandl.com/data/NASDAQOMX/LDRIG05-LadderRite-0-5year-USD-Corporate-Bond-Index-LDRIG05',
      'frequency': 'Daily',
      'refreshed': '20 hours ago',
      'provider': 'Quandl'
    },{
      'name': 'Intercontinental Exchange Futures Data',
      'description': "Futures data for softs, grains, energy products and financial instruments, with historical contracts going back decades.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/6894/intercontinental-exchange-futures-data.png',
      'code': 'ICE/WAN2019',
      'outlink' : 'https://www.quandl.com/data/ICE/WAN2019-Milling-Wheat-Futures-July-2019-WAN2019',
      'frequency': 'Daily',
      'refreshed': '19 hours ago',
      'provider': 'Quandl'
    },{
      'name': 'Global Food Prices Database',
      'description': "The Global Food Prices Database has data on food prices (e.g., beans, rice, fish, and sugar) for 76 countries and some 1,500 markets.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/13138/ueng.png',
      'code': '',
      'dataid': '8ed86473-7fb3-4e6c-8fac-60ae1f3358b5',
      'outlink' : 'https://public.enigma.com/datasets/467d9a94-1842-41af-84f5-52b273b1ca02',
      'frequency': 'Annual',
      'refreshed': 'Last month',
      'provider': 'Enigma'
    },{
      'name': 'National Stock Exchange of India',
      'description': "Stock and index data from the National Stock Exchange of India.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/33/nse.png',
      'code': 'NSE/DOLLAR',
      'outlink' : 'https://www.quandl.com/data/NSE/DOLLAR-Dollar-Industries-Limited',
      'frequency': 'Daily',
      'refreshed': '8 hours ago',
      'provider': 'Quandl'
    },{
      'name': 'Yale Department of Economics',
      'description': "Publishes data related to the stock and housing markets; price data for common indexes, interest rates, earnings, dividends, house prices, and CPI.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/175/images-1.jpg',
      'code': 'YALE/RBCI',
      'outlink' : 'https://www.quandl.com/data/YALE/RBCI-Historical-Housing-Market-Data-Real-Building-Cost-Index',
      'frequency': 'Annual',
      'refreshed': 'Last year',
      'provider': 'Quandl'
    },{
      'name': ' London Bullion Market Association',
      'description': "An international trade association in the London gold and silver market, consisting of central banks, private investors, producers, refiners, and other agents.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/139/Screen_Shot_2014-08-11_at_10.32.40_AM.png',
      'code': 'LBMA/GOLD',
      'outlink' : 'https://www.quandl.com/data/LBMA/GOLD-Gold-Price-London-Fixing',
      'frequency': 'Daily',
      'refreshed': '5 hours ago',
      'provider': 'Quandl'
    },{
      'name': 'U.S. Energy Information Administration Data',
      'description': "US national and state data on production, consumption and other indicators on all major energy products, such as electricity, coal, natural gas and petroleum.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/661/thumb_us-energy-information-administration-data.jpg',
      'code': 'EIA/AEO_2016_REF_NO_CPP_PRCE_NA_COMM_NA_NG_NA_NENGL_Y13DLRPMCF_A',
      'outlink' : 'https://www.quandl.com/data/EIA/AEO_2016_REF_NO_CPP_PRCE_NA_COMM_NA_NG_NA_NENGL_Y13DLRPMCF_A-Natural-Gas-Delivered-Commercial-New-England-No-CPP-AEO2016',
      'frequency': 'Annual',
      'refreshed': 'Last year',
      'provider': 'Quandl'
    },{
      'name': 'LIFFE Futures Data',
      'description': "Futures data from LIFFE for a variety of equities, softs and grains. Contains years of history for many futures.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/1304/thumb_nyse_liffe_logo.jpg',
      'code': 'LIFFE/TK2019',
      'outlink' : 'https://www.quandl.com/data/LIFFE/TK2019-UK-Feed-Wheat-Future-May-2019-TK2019',
      'frequency': 'Daily',
      'refreshed': '4 hours ago',
      'provider': 'Quandl'
    },{
      'name': 'World Bank World Development Indicators',
      'description': "Most current and accurate development indicators, compiled from officially-recognized international sources.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/13565/icon.jpg',
      'code': 'WWDI/PYF_SL_UEM_1524_MA_ZS',
      'outlink' : 'https://www.quandl.com/data/WWDI/PYF_SL_UEM_1524_MA_ZS-Unemployment-youth-male-of-male-labor-force-ages-15-24-French-Polynesia',
      'frequency': 'Annual',
      'refreshed': 'Last year',
      'provider': 'Quandl'
    },{
      'name': 'British Petroleum',
      'description': "BP is a large energy producer and distributor. It provides data on energy production and consumption in individual countries and larger subregions.",
      'img': 'https://quandl-data-upload.s3.amazonaws.com/uploads/source/profile_image/154/bp.png',
      'code': 'BP/COAL_PROD_O_MNG',
      'outlink' : 'https://www.quandl.com/data/BP/COAL_PROD_O_MNG-Coal-Production-Oil-Equivalent-Mongolia',
      'frequency': 'Annual',
      'refreshed': 'Last year',
      'provider': 'Quandl'
    }
  ];
  var build_side_panel = function(main_panel, side_panel) {
    side_panel.css('display', 'none');
    side_panel.insertAfter(main_panel);
    var side_panel_splitbar = $('<div class="data_side_panel_splitbar">');
    var side_panel_inner = $('<div class="data_side_panel_inner">');
    side_panel.append(side_panel_inner);
    side_panel.append(side_panel_splitbar);

    var min_rel_width = 10, max_rel_width = 90;
    side_panel_splitbar.mousedown(function(md_evt) {
      md_evt.preventDefault();
      $(document).mousemove(function (mm_evt){
        mm_evt.preventDefault();
        var pix_w = mm_evt.pageX;
        var rel_w = 100 * (pix_w) / side_panel.parent().width();
        rel_w = rel_w > min_rel_width ? rel_w : min_rel_width;
        rel_w = rel_w < max_rel_width ? rel_w : max_rel_width;
        main_panel.css('width', (100 - rel_w) + '%');
        side_panel.css('width', rel_w + '%').data('last_width', rel_w);
      });
      return false;
    });
    $(document).mouseup(function (mu_evt){
      $(document).unbind('mousemove');
    });
    return side_panel;
  };

  var slide_side_panel = function(main_panel, side_panel, desired_width) {
    var anim_opts = {
      step: function (now, tween) {
        main_panel.css('width', 100 - now + '%');
      }
    };
    if (desired_width === undefined) {
      if (side_panel.is(':hidden')) {
        desired_width = (side_panel.data('last_width') || side_panel_start_width);
      } else {
        desired_width = 0;
      }
    }
    var visible = desired_width > 0;
    if (visible) {
      main_panel.css({'float': 'right', 'overflow-x':'auto'});
      side_panel.show();
    } else {
      anim_opts['complete'] = function () {
        side_panel.hide();
        main_panel.css({'float': '', 'overflow-x':'', 'width':''});
      };
    }
    side_panel.animate({width:  desired_width + '%' },anim_opts);
    return visible;
  };
  
  var populate_side_panel = function(side_panel) {
    var side_panel_inner = side_panel.find('.data_side_panel_inner');
    var src = '';

    if (active_page == 1) {
      // src goes here
      var searchbar = $('<br><div class="input-group"><input type="text" placeholder="Search..." class="form-control" id="data_query"> \
       <span class="input-group-btn"> \
       <button class="btn btn-default" title="clear search and reload" id="clear-search"><i class="fa-repeat fa"></i></button> </span></div>');
      // populate all products
      var divholder = $('<div class="holder">');
      $.each(datasets, function(idx){
        var d = datasets[idx];
        var hit = $('<div class="hit">');
        var hitimage = $('<div class="hit-image">').click(pf)
            .append($('<img src=' + d.img + '>'));
        var pf = (function(i){ return function(){ active_page = 2; active_product = i; redo_panel();} })(idx);
        var hitcontent = $('<div class="hit-content">')
            .append($('<h4 class="hit-name">').html(d.name).click(pf))
            .append($('<p class="hit-description">').html(d.description))
            .append($('<span>').html('CODE:'))
            .append($('<span class="hit-code">').html(d.code));
        hit.append(hitimage).append(hitcontent);
        divholder.append(hit);
      });
      side_panel_inner.append(searchbar)
                      .append(divholder);
    } else if (active_page == 2) {
      var p = datasets[active_product];
      var pf = (function(){ return function(){ active_page = 1; redo_panel();} })();
      var buttonRow = $('<div class="row">');
      var goBack = $('<div class="go-back"> &lt; Go back</div>').click(pf);
      var openOutside, providerLink;
      if (p.provider == 'Quandl') {
        openOutside = $('<button class="btn outlinkbtn"><a href="' + p.outlink + '" target="_blank"> \
        <i class="fa fa-external-link"></i> Open in Quandl</a></button>');  
        providerLink = $('<p>').append($('<img src="' + quandlIcon + '">')).append(openOutside);
      } else {
        openOutside = $('<button class="btn outlinkbtn" style="background-color:black"><a href="' + p.outlink + '" target="_blank"> \
        <i class="fa fa-external-link"></i> Open in Enigma Public</a></button>');
        providerLink = $('<p>').append($('<img src="' + enigmaIcon + '" style="width:140px">')).append(openOutside);
      }
      
      buttonRow.append(goBack);
      
      var divholder = $('<div class="row" style="background-color:#FFFFFF">');
      var divcolumn = $('<div class="des-column">');
      var code;
      if (p.provider == 'Quandl'){
        code = 'quandl.get("' + p.code + '")';
      } else {
        code = "import requests \n\
url = 'https://public.enigma.com/api/snapshots/" + p.dataid + "?&row_limit=100'\n\
response = requests.get(url)\n\
data = response.json()\n\
df = pd.DataFrame(data=data['table_rows']['rows'],columns=data['table_rows']['fields']) \n\
df\n ";
      }
      var pf = (function(c){ return function() {dragging = c}})(code);
      var codeblock = $('<pre>' + code  + '</pre>')
          .draggable({'helper':'clone', 'appendTo': 'body', 'start':pf})
          .addClass('dsDrag');

      var hit = $('<div class="hit">');
      var hitimage = $('<div class="hit-image">')
            .append($('<img src=' + p.img + '>'));
      var hitcontent = $('<div class="hit-content">')
            .append($('<h4 class="hit-name">').html(p.name))
      hit.append(hitimage).append(hitcontent);

      divcolumn.append(hit)
               .append($('<div><strong>PROVIDER</strong></div>'))
               .append(providerLink)
               .append($('<hr>'))
               .append($('<div><strong>REFRESHED</strong></div>'))
               .append($('<p>').html(p.refreshed))
               .append($('<hr>'))
               .append($('<div><strong>FREQUENCY</strong></div>'))
               .append($('<span class="data-label">').html(p.frequency))
               .append($('<hr>'))
               .append($('<div><strong>DESCRIPTION</strong></div>'))
               .append($('<p>').html(p.description))
               .append($('<hr>'))
               .append($('<div><strong>SOURCE</strong></div>'))
               .append($('<a href="' + p.outlink+ '" target="_blank">').html(p.outlink))
               .append($('<hr>'))
               .append($('<div><strong>PYTHON CODE EXAMPLE</strong></div>'))
               .append(codeblock)
      divholder.append(divcolumn);
      side_panel_inner.append(buttonRow)
                      .append(divholder);
    }
    
    button_bindings();
  };

  var button_bindings = function () {
    Jupyter.keyboard_manager.register_events($('.form-control'));
    var searchHits = function () {
      query = $('#data_query').val().toLowerCase();
      $.each(datasets, function(idx){
        var d = datasets[idx];
        var des = d.description.toLowerCase();
        var na = d.name.toLowerCase();
        if (query == '' || des.indexOf(query) >= 0 || na.indexOf(query) >= 0) {
          $('.hit:eq('+ idx +')').removeClass('hide');
        } else {
          $('.hit:eq('+ idx +')').addClass('hide');
        }
      });
    };
    if (query) {
      $('#data_query').val(query);
      searchHits();
    } 
    $('#data_query').keyup(searchHits);
    $('#clear-search').click(function(){
      $('#data_query').val('');
      searchHits();
    });
  }
  redo_panel = function() {
    var p = $('#data_side_panel');
    p.find('.data_side_panel_inner').html('');
    setTimeout(function() {populate_side_panel(p);}, 20);
  };

  var toggle_side_panel = function() {
    var main_panel = $('#notebook_panel');
    var side_panel = $('#data_side_panel');

    if (side_panel.length < 1) {
      side_panel = $('<div id=data_side_panel>');
      build_side_panel(main_panel, side_panel);
      populate_side_panel(side_panel);  
    }
    var visible = slide_side_panel(main_panel, side_panel);
    return visible;
  };
  
  Jupyter.toolbar.add_buttons_group([{
    'label'   : 'Open Data Browser',
    'icon'    : 'fa-database',
    'id'      : 'btn_datasets',
    'callback': function() {
      var visible = toggle_side_panel();
      var btn = $(this);
      setTimeout(function() {btn.blur();}, 500);
    }
  }]);

  $('#btn_datasets').attr({
    'data-toggle': 'button',
    'aria-pressed': 'false'
  });

  // bind drop event
  var bindDroppable = function() {
    $('.cell').droppable({
      accept: '.dsDrag',
      hoverClass: 'cell-dragover',
      drop: function(event, ui) {
        Jupyter.notebook.select($(this).index());
        var new_cell = Jupyter.notebook.insert_cell_below('code');
        new_cell.set_text(dragging);
      }
    });
  };
  setInterval(bindDroppable, 1000);
});