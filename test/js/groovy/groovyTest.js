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

var BeakerXPageObject = require('../beakerx.po.js');
var PlotHelperObject = require('../plot.helper.js');
var beakerxPO;
var plotHelper;

describe('Groovy base tests. ', function () {

  beforeAll(function () {
    beakerxPO = new BeakerXPageObject();
    plotHelper = new PlotHelperObject();
    beakerxPO.runNotebookByUrl('/test/ipynb/groovy/GroovyTest.ipynb');
    beakerxPO.openUIWindow();
  }, 2);

  afterAll(function () {
    beakerxPO.closeAndHaltNotebook();
  });

  var cellIndex;
  var imageDir = 'groovy/groovy';

  describe('UI options. ', function () {
    it("Use new table widget. ", function () {
      beakerxPO.setDataGridForTable(true, false);
    });
  });

  describe('Define local and global variables. ', function () {
    it('Execute result output contains "2". ', function () {
      cellIndex = 0;
      beakerxPO.runAndCheckOutputTextOfExecuteResult(cellIndex, /2/);
    });
  });

  describe('Run cell with error. ', function () {
    it('Stderr output contains "groovy.lang.MissingPropertyException". ', function () {
      cellIndex += 1;
      beakerxPO.runAndCheckOutputTextOfStderr(cellIndex, /groovy.lang.MissingPropertyException/);
    });
  });

  describe('Call global variable. ', function () {
    it('Execute result output contains "2". ', function () {
      cellIndex += 1;
      beakerxPO.runAndCheckOutputTextOfExecuteResult(cellIndex, /2/);
    });
  });

  describe('Define groovy closure. ', function () {
    it('Execute result output contains "run_closure". ', function () {
      cellIndex += 1;
      beakerxPO.runAndCheckOutputTextOfExecuteResult(cellIndex, /run_closure/);
    });
  });

  describe('Call defined closure with number argument. ', function () {
    it('Execute result output contains "8". ', function () {
      cellIndex += 1;
      beakerxPO.runAndCheckOutputTextOfExecuteResult(cellIndex, /8/);
    });
  });

  describe('Call defined closure with string argument. ', function () {
    it('Execute result output contains "Multiplying Strings!Multiplying Strings!". ', function () {
      cellIndex += 1;
      beakerxPO.runAndCheckOutputTextOfExecuteResult(cellIndex, /Multiplying Strings!Multiplying Strings!/);
    });
  });

  describe('Call groovy method of Math package. ', function () {
    it('Execute result output contains "9.265". ', function () {
      cellIndex += 1;
      beakerxPO.runAndCheckOutputTextOfExecuteResult(cellIndex,  /9.265/);
    });
  });

  function checkCyrilicString(str){
    expect(str.charCodeAt(0).toString(16)).toEqual('44d');
    expect(str.charCodeAt(1).toString(16)).toEqual('44e');
    expect(str.charCodeAt(2).toString(16)).toEqual('44f');
  }

  describe('Cyrillic symbols (Groovy). ', function () {
    var dtContainer;

    it('Stdout output contains UTF-8 hex string. ', function () {
      cellIndex += 1;
      dtContainer = beakerxPO.runCellToGetDtContainer(cellIndex);
      beakerxPO.waitAndCheckOutputTextOfStdout(cellIndex, /d18dd18ed18f/);
    });

    it('Plot title is cyrillic (cp1521). ', function () {
      checkCyrilicString(plotHelper.getPlotTitle(dtContainer).getText());
    });

    it('Plot x label is cyrillic (utf8 from cp1521). ', function () {
      checkCyrilicString(plotHelper.getXLabel(dtContainer).getText());
    });

    it('Plot y label is cyrillic (utf-8). ', function () {
      checkCyrilicString(plotHelper.getYLabel(dtContainer).getText());
    });
  });

  describe('getCodeCells(tag) method. ', function () {

    it('Tag cell output contains "5". ', function(){
      cellIndex += 1;
      beakerxPO.runAndCheckOutputTextOfExecuteResult(cellIndex,  /5/);
    });

    it('Output contains table. ', function () {
      cellIndex += 1;
      var fileName = 'cell10_case1.png';
      var width = 410, height = 43;
      var canvas = beakerxPO.runCellToGetCanvas(cellIndex);
      var imageData = beakerxPO.getCanvasImageData(canvas, width, height);
      beakerxPO.checkImageData(imageData.value, imageDir, fileName);
      cellIndex += 1;
    });
  });

  describe('Display array as table. ', function () {
    it('Output contains table. ', function () {
      cellIndex += 1;
      var fileName = 'cell11_case1.png';
      var width = 90, height = 43;
      var canvas = beakerxPO.runCellToGetCanvas(cellIndex);
      var imageData = beakerxPO.getCanvasImageData(canvas, width, height);
      beakerxPO.checkImageData(imageData.value, imageDir, fileName);
      cellIndex += 1;
    });
  });

  describe('Display array with null value. ', function () {
    it('Output contains table. ', function () {
      cellIndex += 1;
      var fileName = 'cell12_case1.png';
      var width = 130, height = 65;
      var canvas = beakerxPO.runCellToGetCanvas(cellIndex);
      var imageData = beakerxPO.getCanvasImageData(canvas, width, height);
      beakerxPO.checkImageData(imageData.value, imageDir, fileName);
      cellIndex += 1;
    });
  });

  describe('(Groovy) Press "Tab" to autocomplete code ', function(){
    it('Autocomplete list is not empty ', function(){
      cellIndex += 1;
      var codeCell = beakerxPO.getCodeCellByIndex(cellIndex);
      var completeList = beakerxPO.callAutocompleteAndGetItsList(codeCell, 'de');
      expect(completeList.length).toBeGreaterThan(0);
    });
  });

  describe('(Groovy) Press "Shift + Tab" to display javadoc ', function(){
    it('doc tooltip is not empty ', function(){
      cellIndex += 1;
      var codeCell = beakerxPO.getCodeCellByIndex(cellIndex);
      var tooltip = beakerxPO.callDocAndGetItsTooltip(codeCell, 'EasyForm');
      expect(tooltip.getText()).toMatch(/com.twosigma.beakerx.easyform.EasyForm/);
    });
  });

});