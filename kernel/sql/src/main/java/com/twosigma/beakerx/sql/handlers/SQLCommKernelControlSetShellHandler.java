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
package com.twosigma.beakerx.sql.handlers;

import com.twosigma.beakerx.kernel.comm.KernelControlGetDefaultShellHandler;
import com.twosigma.beakerx.kernel.KernelFunctionality;

public class SQLCommKernelControlSetShellHandler extends KernelControlGetDefaultShellHandler {

  public SQLCommKernelControlSetShellHandler(KernelFunctionality kernel) {
    super(kernel);
  }

  @Override
  public String[] getDefaultImports() {
    return new String[0];
  }

  @Override
  public String[] getDefaultClassPath() {
    return new String[0];
  }
}
