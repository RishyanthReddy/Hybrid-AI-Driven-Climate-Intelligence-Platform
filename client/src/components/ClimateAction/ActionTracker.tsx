import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useClimateData } from "../../lib/stores/useClimateData";
import { useAlgorithms } from "../../lib/hooks/useAlgorithms";
import { ClimateAction, ActionStatus, ActionCategory } from "../../types/climate";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Progress } from "../ui/progress";

const ActionTracker: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ActionCategory | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<ActionStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddAction, setShowAddAction] = useState(false);
  const [newAction, setNewAction] = useState<Partial<ClimateAction>>({});

  const { climateData, isLoading } = useClimateData();
  const { climateScoreResults, isProcessing } = useAlgorithms();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Generate climate actions data
  const actionsData = React.useMemo(() => {
    const categories: ActionCategory[] = ['mitigation', 'adaptation', 'finance', 'technology', 'policy'];
    const statuses: ActionStatus[] = ['planned', 'in_progress', 'completed', 'on_hold'];
    
    return Array.from({ length: 30 }, (_, i) => ({
      id: `action-${i + 1}`,
      title: [
        "Solar Panel Installation Program",
        "Urban Forest Expansion Initiative",
        "Carbon Capture Technology Deployment",
        "Green Building Standards Implementation",
        "Electric Vehicle Infrastructure",
        "Renewable Energy Transition",
        "Climate Resilience Training",
        "Sustainable Agriculture Program",
        "Waste Reduction Campaign",
        "Energy Efficiency Retrofits"
      ][i % 10],
      description: "Comprehensive climate action initiative designed to reduce emissions and improve environmental resilience through innovative approaches.",
      category: categories[i % categories.length],
      status: statuses[i % statuses.length],
      priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      progress: Math.floor(Math.random() * 100),
      startDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      targetDate: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      budget: 100000 + Math.floor(Math.random() * 900000),
      spent: Math.floor(Math.random() * 500000),
      co2Reduction: Math.floor(Math.random() * 1000),
      stakeholders: [
        "Government Agency",
        "Private Sector",
        "NGO Partners",
        "Community Groups"
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      location: "Region " + String.fromCharCode(65 + (i % 5)),
      metrics: {
        energySaved: Math.floor(Math.random() * 500) + 100,
        emissionsReduced: Math.floor(Math.random() * 100) + 10,
        beneficiaries: Math.floor(Math.random() * 5000) + 500,
        jobsCreated: Math.floor(Math.random() * 50) + 5
      },
      milestones: [
        { name: "Planning Phase", completed: true, date: new Date(2024, 1, 15) },
        { name: "Implementation Start", completed: Math.random() > 0.3, date: new Date(2024, 3, 1) },
        { name: "Mid-term Review", completed: Math.random() > 0.6, date: new Date(2024, 6, 15) },
        { name: "Final Assessment", completed: Math.random() > 0.8, date: new Date(2024, 11, 30) }
      ]
    }));
  }, [climateData]);

  const filteredActions = React.useMemo(() => {
    return actionsData.filter(action => {
      const categoryMatch = selectedCategory === "all" || action.category === selectedCategory;
      const statusMatch = selectedStatus === "all" || action.status === selectedStatus;
      const searchMatch = searchTerm === "" || 
        action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return categoryMatch && statusMatch && searchMatch;
    });
  }, [actionsData, selectedCategory, selectedStatus, searchTerm]);

  const actionStats = React.useMemo(() => {
    const total = filteredActions.length;
    const byStatus = filteredActions.reduce((acc, action) => {
      acc[action.status] = (acc[action.status] || 0) + 1;
      return acc;
    }, {} as Record<ActionStatus, number>);

    const totalBudget = filteredActions.reduce((sum, action) => sum + action.budget, 0);
    const totalSpent = filteredActions.reduce((sum, action) => sum + action.spent, 0);
    const totalCO2Reduction = filteredActions.reduce((sum, action) => sum + action.co2Reduction, 0);
    const avgProgress = Math.round(filteredActions.reduce((sum, action) => sum + action.progress, 0) / total);

    return {
      total,
      completed: byStatus.completed || 0,
      inProgress: byStatus.in_progress || 0,
      planned: byStatus.planned || 0,
      onHold: byStatus.on_hold || 0,
      totalBudget,
      totalSpent,
      budgetUtilization: Math.round((totalSpent / totalBudget) * 100),
      totalCO2Reduction,
      avgProgress: isNaN(avgProgress) ? 0 : avgProgress
    };
  }, [filteredActions]);

  const getStatusColor = (status: ActionStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'planned': return 'bg-yellow-500';
      case 'on_hold': return 'bg-red-500';
    }
  };

  const getStatusBadgeVariant = (status: ActionStatus) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'default';
      case 'planned': return 'secondary';
      case 'on_hold': return 'destructive';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-white';
    }
  };

  const getCategoryIcon = (category: ActionCategory) => {
    switch (category) {
      case 'mitigation': return 'fas fa-leaf';
      case 'adaptation': return 'fas fa-shield-alt';
      case 'finance': return 'fas fa-dollar-sign';
      case 'technology': return 'fas fa-cog';
      case 'policy': return 'fas fa-gavel';
    }
  };

  const handleAddAction = () => {
    // In a real app, this would submit to an API
    console.log("Adding new action:", newAction);
    setShowAddAction(false);
    setNewAction({});
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <span className="text-white/80">Loading climate actions...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full overflow-hidden"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <i className="fas fa-tasks text-green-400 mr-3"></i>
              Climate Action Tracker
            </h1>
            <p className="text-white/70">
              Monitor and manage climate action initiatives across all sectors
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {isProcessing && (
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Analyzing...</span>
              </div>
            )}
            
            <Dialog open={showAddAction} onOpenChange={setShowAddAction}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600">
                  <i className="fas fa-plus mr-2"></i>
                  Add Action
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Climate Action</DialogTitle>
                  <DialogDescription>
                    Create a new climate action to track progress and impact.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Action Title"
                    value={newAction.title || ""}
                    onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newAction.description || ""}
                    onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                  />
                  <Select onValueChange={(value: ActionCategory) => setNewAction({ ...newAction, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mitigation">Mitigation</SelectItem>
                      <SelectItem value="adaptation">Adaptation</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddAction} className="flex-1">Add Action</Button>
                    <Button variant="outline" onClick={() => setShowAddAction(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <Input
            placeholder="Search actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          
          <Select value={selectedCategory} onValueChange={(value: ActionCategory | "all") => setSelectedCategory(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="mitigation">Mitigation</SelectItem>
              <SelectItem value="adaptation">Adaptation</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="policy">Policy</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={(value: ActionStatus | "all") => setSelectedStatus(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        {/* Stats Panel */}
        <motion.div variants={itemVariants} className="w-80 border-r border-white/10 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Overview Stats */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{actionStats.total}</div>
                    <div className="text-sm text-white/60">Total Actions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{actionStats.totalCO2Reduction}</div>
                    <div className="text-sm text-white/60">MT CO₂ Reduced</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Overall Progress</span>
                    <span className="text-white font-semibold">{actionStats.avgProgress}%</span>
                  </div>
                  <Progress value={actionStats.avgProgress} className="w-full" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Budget Utilization</span>
                    <span className="text-white font-semibold">{actionStats.budgetUtilization}%</span>
                  </div>
                  <Progress value={actionStats.budgetUtilization} className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Status Breakdown */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { status: 'completed', count: actionStats.completed, label: 'Completed' },
                  { status: 'in_progress', count: actionStats.inProgress, label: 'In Progress' },
                  { status: 'planned', count: actionStats.planned, label: 'Planned' },
                  { status: 'on_hold', count: actionStats.onHold, label: 'On Hold' }
                ].map(({ status, count, label }) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(status as ActionStatus)}`}></div>
                      <span className="text-white/80">{label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">{count}</span>
                      <span className="text-white/50 text-sm">
                        ({actionStats.total > 0 ? Math.round((count / actionStats.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Budget Overview */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">Budget Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Budget</span>
                  <span className="text-white font-semibold">
                    ${(actionStats.totalBudget / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Spent</span>
                  <span className="text-white font-semibold">
                    ${(actionStats.totalSpent / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Remaining</span>
                  <span className="text-white font-semibold">
                    ${((actionStats.totalBudget - actionStats.totalSpent) / 1000000).toFixed(1)}M
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Actions List */}
        <motion.div variants={itemVariants} className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-4">
            {filteredActions.map((action) => (
              <Card key={action.id} className="glass hover:bg-white/10 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 glass rounded-lg">
                        <i className={`${getCategoryIcon(action.category)} text-green-400`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{action.title}</h3>
                        <p className="text-white/60 text-sm">{action.location} • {action.stakeholders.join(", ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusBadgeVariant(action.status)}>
                        {action.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className={`text-sm font-medium ${getPriorityColor(action.priority)}`}>
                        {action.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-4">{action.description}</p>
                  
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-white/70">Progress</div>
                      <div className="text-lg font-semibold text-white">{action.progress}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/70">Budget</div>
                      <div className="text-lg font-semibold text-white">${(action.budget / 1000).toFixed(0)}k</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/70">CO₂ Reduction</div>
                      <div className="text-lg font-semibold text-green-400">{action.co2Reduction} MT</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/70">Beneficiaries</div>
                      <div className="text-lg font-semibold text-white">{action.metrics.beneficiaries.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/70 text-sm">Progress</span>
                        <span className="text-white text-sm">{action.progress}%</span>
                      </div>
                      <Progress value={action.progress} className="w-full" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/70">Target Date</div>
                      <div className="text-white font-medium">
                        {action.targetDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {action.milestones.slice(0, 3).map((milestone, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            milestone.completed ? 'bg-green-400' : 'bg-white/20'
                          }`}
                          title={milestone.name}
                        />
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <i className="fas fa-eye mr-2"></i>
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <i className="fas fa-edit mr-2"></i>
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ActionTracker;
